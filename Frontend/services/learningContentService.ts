export interface Article {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  readTime: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  image: string;
  isVideo?: boolean;
  tags: string[];
  author: string;
  publishedDate: string;
  lastUpdated: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  articleCount: number;
}

export const LEARNING_CATEGORIES: Category[] = [
  {
    id: 'investing',
    name: 'Investing 101',
    description: 'Learn the basics of investing in stocks, bonds, and other securities',
    color: '#10B981',
    articleCount: 24,
  },
  {
    id: 'budgeting',
    name: 'Budgeting',
    description: 'Master personal budgeting and expense management',
    color: '#3B82F6',
    articleCount: 18,
  },
  {
    id: 'retirement',
    name: 'Retirement Planning',
    description: 'Plan for a secure financial future',
    color: '#8B5CF6',
    articleCount: 15,
  },
  {
    id: 'insurance',
    name: 'Insurance',
    description: 'Understand different types of insurance and protection',
    color: '#F59E0B',
    articleCount: 12,
  },
  {
    id: 'business',
    name: 'Business Finance',
    description: 'Financial management for entrepreneurs and business owners',
    color: '#EF4444',
    articleCount: 20,
  },
  {
    id: 'analysis',
    name: 'Market Analysis',
    description: 'Learn to analyze markets and make informed decisions',
    color: '#06B6D4',
    articleCount: 16,
  },
];

export const FEATURED_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Understanding Stocks and Bonds',
    category: 'Investing 101',
    description: "A beginner's guide to the two most common types of investments.",
    content: `
# Understanding Stocks and Bonds

## Introduction
Stocks and bonds are the foundation of most investment portfolios. Understanding these two asset classes is crucial for any investor.

## What Are Stocks?
Stocks represent ownership shares in a company. When you buy stock, you become a partial owner of that business.

### Benefits of Stocks:
- Potential for high returns
- Dividend income
- Liquidity
- Ownership rights

### Risks of Stocks:
- Price volatility
- Market risk
- Company-specific risk

## What Are Bonds?
Bonds are debt securities. When you buy a bond, you're lending money to the issuer in exchange for regular interest payments.

### Benefits of Bonds:
- Regular income
- Lower volatility than stocks
- Capital preservation
- Diversification

### Risks of Bonds:
- Interest rate risk
- Credit risk
- Inflation risk

## Building a Balanced Portfolio
Most financial advisors recommend a mix of stocks and bonds based on your:
- Age
- Risk tolerance
- Investment goals
- Time horizon

## Conclusion
Understanding stocks and bonds is the first step toward building a successful investment portfolio. Start with low-cost index funds to gain exposure to both asset classes.
    `,
    readTime: 8,
    difficulty: 'Beginner',
    rating: 4.8,
    image: 'https://via.placeholder.com/600x400/E5E7EB/6B7280?text=Stocks+%26+Bonds',
    tags: ['stocks', 'bonds', 'investing', 'portfolio'],
    author: 'Sarah Johnson',
    publishedDate: '2024-01-15',
    lastUpdated: '2024-08-10',
  },
  {
    id: '2',
    title: 'How to Build a Diversified Portfolio',
    category: 'Investing 101',
    description: 'Learn the fundamentals of portfolio diversification and risk management.',
    content: `
# How to Build a Diversified Portfolio

## The Importance of Diversification
"Don't put all your eggs in one basket" - this age-old wisdom is the foundation of portfolio diversification.

## Asset Class Diversification
Spread your investments across:
- Stocks (domestic and international)
- Bonds (government and corporate)
- Real estate (REITs)
- Commodities
- Cash equivalents

## Geographic Diversification
- Domestic markets
- Developed international markets
- Emerging markets

## Sector Diversification
Invest across different industries:
- Technology
- Healthcare
- Financial services
- Consumer goods
- Energy
- Utilities

## Rebalancing Your Portfolio
Regular rebalancing ensures your portfolio stays aligned with your target allocation.

## Common Mistakes to Avoid
- Over-diversification
- Ignoring correlation
- Emotional investing
- Lack of rebalancing
    `,
    readTime: 12,
    difficulty: 'Intermediate',
    rating: 4.9,
    image: 'https://via.placeholder.com/600x400/E5E7EB/6B7280?text=Portfolio+Diversification',
    tags: ['diversification', 'portfolio', 'risk management', 'asset allocation'],
    author: 'Michael Chen',
    publishedDate: '2024-02-20',
    lastUpdated: '2024-08-12',
  },
  {
    id: '3',
    title: 'Emergency Fund Essentials',
    category: 'Budgeting',
    description: 'Why you need an emergency fund and how to build one effectively.',
    content: `
# Emergency Fund Essentials

## What Is an Emergency Fund?
An emergency fund is money set aside to cover unexpected expenses or financial emergencies.

## Why You Need One
- Job loss protection
- Medical emergencies
- Major repairs
- Peace of mind

## How Much Should You Save?
- Minimum: $1,000
- Ideal: 3-6 months of expenses
- High-risk jobs: 6-12 months

## Where to Keep Your Emergency Fund
- High-yield savings account
- Money market account
- Short-term CDs
- Avoid: Stocks, long-term investments

## Building Your Fund
1. Start small
2. Automate savings
3. Use windfalls
4. Cut unnecessary expenses
5. Increase gradually

## When to Use It
Only for true emergencies:
- Unexpected medical bills
- Job loss
- Major home repairs
- Car repairs (if needed for work)

## Replenishing Your Fund
After using your emergency fund, make replenishing it a top priority.
    `,
    readTime: 6,
    difficulty: 'Beginner',
    rating: 4.7,
    image: 'https://via.placeholder.com/600x400/E5E7EB/6B7280?text=Emergency+Fund',
    tags: ['emergency fund', 'budgeting', 'savings', 'financial security'],
    author: 'Emily Rodriguez',
    publishedDate: '2024-03-10',
    lastUpdated: '2024-08-05',
  },
  {
    id: '4',
    title: 'Cryptocurrency Investment Strategies',
    category: 'Investing 101',
    description: 'Understanding digital currencies and how to invest safely.',
    content: `
# Cryptocurrency Investment Strategies

## Understanding Cryptocurrency
Cryptocurrencies are digital assets that use blockchain technology for security and decentralization.

## Popular Cryptocurrencies
- Bitcoin (BTC)
- Ethereum (ETH)
- Binance Coin (BNB)
- Cardano (ADA)
- Solana (SOL)

## Investment Strategies

### Dollar-Cost Averaging (DCA)
Invest a fixed amount regularly regardless of price.

### HODLing
Buy and hold for the long term.

### Trading
Active buying and selling (high risk).

## Risk Management
- Only invest what you can afford to lose
- Diversify across different cryptocurrencies
- Use secure wallets
- Understand the technology

## Security Best Practices
- Use hardware wallets
- Enable two-factor authentication
- Keep private keys secure
- Beware of scams

## Tax Implications
Cryptocurrency transactions may be taxable events. Consult a tax professional.
    `,
    readTime: 15,
    difficulty: 'Advanced',
    rating: 4.6,
    image: 'https://via.placeholder.com/600x400/E5E7EB/6B7280?text=Cryptocurrency',
    isVideo: true,
    tags: ['cryptocurrency', 'bitcoin', 'blockchain', 'digital assets'],
    author: 'David Kim',
    publishedDate: '2024-04-05',
    lastUpdated: '2024-08-15',
  },
];

class LearningContentService {
  private articles: Article[] = FEATURED_ARTICLES;
  private categories: Category[] = LEARNING_CATEGORIES;

  getAllArticles(): Article[] {
    return this.articles;
  }

  getArticleById(id: string): Article | undefined {
    return this.articles.find(article => article.id === id);
  }

  getArticlesByCategory(categoryId: string): Article[] {
    const category = this.categories.find(cat => cat.id === categoryId);
    if (!category) return [];
    
    return this.articles.filter(article => article.category === category.name);
  }

  getArticlesByDifficulty(difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): Article[] {
    return this.articles.filter(article => article.difficulty === difficulty);
  }

  searchArticles(query: string): Article[] {
    const lowercaseQuery = query.toLowerCase();
    return this.articles.filter(article =>
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.description.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      article.content.toLowerCase().includes(lowercaseQuery)
    );
  }

  getCategories(): Category[] {
    return this.categories;
  }

  getCategoryById(id: string): Category | undefined {
    return this.categories.find(category => category.id === id);
  }

  getFeaturedArticles(limit: number = 6): Article[] {
    return this.articles
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  getRecentArticles(limit: number = 5): Article[] {
    return this.articles
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
      .slice(0, limit);
  }

  getRelatedArticles(articleId: string, limit: number = 3): Article[] {
    const article = this.getArticleById(articleId);
    if (!article) return [];

    return this.articles
      .filter(a => a.id !== articleId && a.category === article.category)
      .slice(0, limit);
  }
}

export const learningContentService = new LearningContentService();
export default learningContentService;
