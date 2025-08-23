import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { mockTransactions } from '@/data/mockData';
import { PieChart, BarChart3, Calendar, Filter } from 'lucide-react-native';

export default function ExpensesScreen() {
  const { colors } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Calculate expenses by category
  const expenses = mockTransactions.filter(t => t.type === 'expense');
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Other';
    acc[category] = (acc[category] || 0) + Math.abs(expense.amount);
    return acc;
  }, {} as Record<string, number>);

  const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);

  const categories = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / totalExpenses) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);

  const PeriodButton = ({ title, value }: { title: string; value: typeof selectedPeriod }) => (
    <TouchableOpacity
      style={[
        styles.periodButton,
        {
          backgroundColor: selectedPeriod === value ? colors.primary : colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={() => setSelectedPeriod(value)}
    >
      <Text
        style={[
          styles.periodButtonText,
          { color: selectedPeriod === value ? '#FFFFFF' : colors.text },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Expenses" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        <PeriodButton title="Week" value="week" />
        <PeriodButton title="Month" value="month" />
        <PeriodButton title="Year" value="year" />
      </View>

      {/* Total Expenses */}
      <Card style={styles.totalCard}>
        <View style={styles.totalHeader}>
          <PieChart size={24} color={colors.primary} />
          <Text style={[styles.totalTitle, { color: colors.text }]}>
            Total Expenses
          </Text>
        </View>
        <Text style={[styles.totalAmount, { color: colors.text }]}>
          ₹{totalExpenses.toLocaleString()}
        </Text>
        <Text style={[styles.totalPeriod, { color: colors.textSecondary }]}>
          This {selectedPeriod}
        </Text>
      </Card>

      {/* Expense Categories */}
      <Card style={styles.categoriesCard}>
        <Text style={[styles.categoriesTitle, { color: colors.text }]}>
          Expense Categories
        </Text>
        
        {categories.map((item, index) => (
          <View key={item.category} style={[styles.categoryItem, { borderBottomColor: colors.border }]}>
            <View style={styles.categoryInfo}>
              <View style={[
                styles.categoryDot,
                { backgroundColor: `hsl(${index * 60}, 70%, 50%)` }
              ]} />
              <Text style={[styles.categoryName, { color: colors.text }]}>
                {item.category}
              </Text>
            </View>
            <View style={styles.categoryValues}>
              <Text style={[styles.categoryAmount, { color: colors.text }]}>
                ₹{item.amount.toLocaleString()}
              </Text>
              <Text style={[styles.categoryPercentage, { color: colors.textSecondary }]}>
                {item.percentage.toFixed(1)}%
              </Text>
            </View>
          </View>
        ))}
      </Card>

      {/* Recent Expenses */}
      <Card style={styles.recentCard}>
        <Text style={[styles.recentTitle, { color: colors.text }]}>
          Recent Expenses
        </Text>
        
        {expenses.slice(0, 8).map((expense, index) => (
          <View key={index} style={[styles.expenseItem, { borderBottomColor: colors.border }]}>
            <View style={styles.expenseInfo}>
              <Text style={[styles.expenseDescription, { color: colors.text }]}>
                {expense.description}
              </Text>
              <Text style={[styles.expenseDate, { color: colors.textSecondary }]}>
                {new Date(expense.date).toLocaleDateString()} • {expense.category}
              </Text>
            </View>
            <Text style={[styles.expenseAmount, { color: colors.error }]}>
              -₹{Math.abs(expense.amount).toLocaleString()}
            </Text>
          </View>
        ))}
      </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    padding: 20,
    paddingBottom: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    paddingVertical: 24,
  },
  totalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  totalTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  totalPeriod: {
    fontSize: 14,
  },
  categoriesCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  categoryValues: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
  },
  recentCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 12,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
