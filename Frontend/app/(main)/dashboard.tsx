import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive, getResponsiveFontSize, getResponsivePadding } from '@/hooks/useResponsive';
import { Card } from '@/components/Card';
import { mockBankAccounts, mockTransactions, mockInvestments } from '@/data/mockData';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Target,
  PieChart
} from 'lucide-react-native';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { isSmall, isTablet } = useResponsive();

  // Calculate totals
  const totalBalance = mockBankAccounts.reduce((sum, account) => sum + account.balance, 0);
  const totalInvestments = mockInvestments.reduce((sum, investment) => sum + investment.currentValue, 0);
  const monthlyExpenses = mockTransactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const stats = [
    {
      title: 'Total Balance',
      value: `₹${totalBalance.toLocaleString()}`,
      icon: DollarSign,
      color: colors.success,
      change: '+2.5%',
      isPositive: true,
    },
    {
      title: 'Investments',
      value: `₹${totalInvestments.toLocaleString()}`,
      icon: TrendingUp,
      color: colors.primary,
      change: '+8.2%',
      isPositive: true,
    },
    {
      title: 'Monthly Expenses',
      value: `₹${monthlyExpenses.toLocaleString()}`,
      icon: CreditCard,
      color: colors.error,
      change: '-5.1%',
      isPositive: false,
    },
    {
      title: 'Savings Goal',
      value: '68%',
      icon: Target,
      color: colors.accent,
      change: '+12%',
      isPositive: true,
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
            Welcome back,
          </Text>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.fullName || 'User'}
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={[
          styles.statsGrid,
          {
            flexDirection: isTablet ? 'row' : 'column',
            flexWrap: isTablet ? 'wrap' : 'nowrap',
          }
        ]}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} style={[
                styles.statCard,
                isTablet ? { flex: 1, minWidth: 250, maxWidth: '48%' } : {}
              ]}>
                <View style={styles.statHeader}>
                  <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                    <IconComponent size={24} color={stat.color} />
                  </View>
                  <View style={[
                    styles.changeIndicator,
                    { backgroundColor: stat.isPositive ? colors.success + '20' : colors.error + '20' }
                  ]}>
                    {stat.isPositive ? (
                      <TrendingUp size={16} color={colors.success} />
                    ) : (
                      <TrendingDown size={16} color={colors.error} />
                    )}
                    <Text style={[
                      styles.changeText,
                      { color: stat.isPositive ? colors.success : colors.error }
                    ]}>
                      {stat.change}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.statTitle, { color: colors.textSecondary }]}>
                  {stat.title}
                </Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {stat.value}
                </Text>
              </Card>
            );
          })}
        </View>

        {/* Quick Actions */}
        <Card style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <View style={[styles.actionItem, { backgroundColor: colors.primary + '10' }]}>
              <PieChart size={24} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.text }]}>
                View Expenses
              </Text>
            </View>
            <View style={[styles.actionItem, { backgroundColor: colors.accent + '10' }]}>
              <Target size={24} color={colors.accent} />
              <Text style={[styles.actionText, { color: colors.text }]}>
                Set Goal
              </Text>
            </View>
            <View style={[styles.actionItem, { backgroundColor: colors.success + '10' }]}>
              <TrendingUp size={24} color={colors.success} />
              <Text style={[styles.actionText, { color: colors.text }]}>
                Investments
              </Text>
            </View>
          </View>
        </Card>

        {/* Recent Transactions */}
        <Card style={styles.recentTransactions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Transactions
          </Text>
          {mockTransactions.slice(0, 5).map((transaction, index) => (
            <View key={index} style={[styles.transactionItem, { borderBottomColor: colors.border }]}>
              <View style={styles.transactionInfo}>
                <Text style={[styles.transactionTitle, { color: colors.text }]}>
                  {transaction.description}
                </Text>
                <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>
                  {new Date(transaction.date).toLocaleDateString()}
                </Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                { 
                  color: transaction.type === 'income' ? colors.success : colors.error 
                }
              ]}>
                {transaction.type === 'income' ? '+' : '-'}₹{Math.abs(transaction.amount).toLocaleString()}
              </Text>
            </View>
          ))}
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statsGrid: {
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    padding: 20,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  recentTransactions: {
    marginBottom: 24,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
