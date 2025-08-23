import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/Card';
import { mockInvestments } from '@/data/mockData';
import { Search, Filter, TrendingUp, TrendingDown } from 'lucide-react-native';

export default function InvestmentsScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'stock' | 'mutual-fund'>('all');

  const filteredInvestments = mockInvestments.filter(investment => {
    const matchesSearch = investment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         investment.ticker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || investment.type === filter;
    return matchesSearch && matchesFilter;
  });

  const FilterButton = ({ title, value }: { title: string; value: typeof filter }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: filter === value ? colors.primary : colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={() => setFilter(value)}
    >
      <Text
        style={[
          styles.filterButtonText,
          { color: filter === value ? '#FFFFFF' : colors.text },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Investments</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Discover and track your investments
        </Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchSection}>
        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search investments..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterContainer}>
          <FilterButton title="All" value="all" />
          <FilterButton title="Stocks" value="stock" />
          <FilterButton title="Mutual Funds" value="mutual-fund" />
        </View>
      </View>

      {/* Portfolio Summary */}
      <Card style={styles.summaryCard}>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>Portfolio Summary</Text>
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              ₹{mockInvestments.reduce((sum, inv) => sum + inv.currentValue, 0).toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Value</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              +₹{mockInvestments.reduce((sum, inv) => sum + (inv.currentValue - inv.purchaseValue), 0).toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Gain</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              +{((mockInvestments.reduce((sum, inv) => sum + (inv.currentValue - inv.purchaseValue), 0) / 
                  mockInvestments.reduce((sum, inv) => sum + inv.purchaseValue, 0)) * 100).toFixed(1)}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Return</Text>
          </View>
        </View>
      </Card>

      {/* Investment List */}
      <View style={styles.investmentsList}>
        {filteredInvestments.map((investment) => {
          const gain = investment.currentValue - investment.purchaseValue;
          const gainPercentage = ((gain / investment.purchaseValue) * 100);
          const isPositive = gain >= 0;

          return (
            <Card key={investment.id} style={styles.investmentCard}>
              <View style={styles.investmentHeader}>
                <View style={styles.investmentInfo}>
                  <Text style={[styles.investmentName, { color: colors.text }]}>
                    {investment.name}
                  </Text>
                  <Text style={[styles.investmentTicker, { color: colors.textSecondary }]}>
                    {investment.ticker} • {investment.type}
                  </Text>
                </View>
                <View style={styles.investmentValues}>
                  <Text style={[styles.currentValue, { color: colors.text }]}>
                    ₹{investment.currentValue.toLocaleString()}
                  </Text>
                  <View style={styles.gainContainer}>
                    {isPositive ? (
                      <TrendingUp size={16} color={colors.success} />
                    ) : (
                      <TrendingDown size={16} color={colors.error} />
                    )}
                    <Text style={[
                      styles.gainText,
                      { color: isPositive ? colors.success : colors.error }
                    ]}>
                      {isPositive ? '+' : ''}₹{gain.toLocaleString()} ({gainPercentage.toFixed(1)}%)
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.investmentDetails}>
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    Purchase Value
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    ₹{investment.purchaseValue.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    Quantity
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {investment.quantity}
                  </Text>
                </View>
              </View>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  searchSection: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  investmentsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  investmentCard: {
    padding: 16,
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  investmentInfo: {
    flex: 1,
  },
  investmentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  investmentTicker: {
    fontSize: 12,
  },
  investmentValues: {
    alignItems: 'flex-end',
  },
  currentValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gainText: {
    fontSize: 12,
    fontWeight: '500',
  },
  investmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});
