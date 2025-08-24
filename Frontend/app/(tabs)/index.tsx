import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, RefreshControl, TouchableOpacity, Animated } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
// import { useAuth } from '@/contexts/AuthContext';
import { useData, useInvestments, usePortfolio } from '@/contexts/DataContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { Header } from '@/components/Header';
import { RealTimeStatus } from '@/components/RealTimeStatus';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const { colors } = useTheme();
  // const { user } = useAuth();
  const { isTablet } = useResponsive();
  const insets = useSafeAreaInsets();

  // Real-time data hooks
  const {
    portfolioData,
    isLoading,
    isRealTimeEnabled,
    lastUpdated,
    error,
    refreshData,
    clearError
  } = useData();

  const {
    investments,
    totalValue,
    totalPurchaseValue,
    totalGainLoss,
    totalGainLossPercent
  } = useInvestments();

  const {
    currentValue: portfolioCurrentValue,
    change: portfolioChange,
    changePercent: portfolioChangePercent
  } = usePortfolio();

  // Convert portfolio data for chart
  const chartData = {
    labels: portfolioData.labels,
    datasets: [{
      data: portfolioData.data.map(value => value * 10000) // Scale for display
    }]
  };

  // Recent investment transactions from real data
  const recentTransactions = investments.slice(0, 5).map(inv => ({
    stock: inv.ticker,
    type: inv.change >= 0 ? 'Gain' : 'Loss',
    amount: Math.abs(inv.change * inv.quantity),
    color: inv.change >= 0 ? colors.success : colors.error,
  }));

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: () => colors.primary,
    labelColor: () => colors.textSecondary,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.6,
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: colors.border,
      strokeWidth: 1,
    },
    formatYLabel: (value: any) => `₹${(parseInt(value) / 100000).toFixed(0)}L`,
  } as const;

  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.stopAnimation(() => spinAnim.setValue(0));
    }
  }, [isLoading]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={[styles.container, {
      backgroundColor: colors.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }]}>
      <Header
        title="My Dashboard"
        rightComponent={
          <View style={styles.headerRight}>
            {error && (
              <TouchableOpacity onPress={clearError} style={styles.errorButton}>
                <Text style={[styles.errorText, { color: colors.error }]}>!</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={refreshData} disabled={isLoading} style={styles.iconButton}>
              {isLoading ? (
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <RefreshCw size={20} color={colors.primary} />
                </Animated.View>
              ) : (
                <RefreshCw size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
            {isRealTimeEnabled ? (
              <Wifi size={16} color={colors.success} style={styles.statusIcon} />
            ) : (
              <WifiOff size={16} color={colors.textSecondary} style={styles.statusIcon} />
            )}
          </View>
        }
      />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshData}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.content}>

        {/* Real-time Status */}
        <RealTimeStatus />

        {/* Error Display */}
        {error && (
          <Card style={[styles.errorCard, { backgroundColor: colors.error + '10', borderColor: colors.error + '30' }]}>
            <View style={styles.errorContent}>
              <Text style={[styles.errorTitle, { color: colors.error }]}>
                Connection Issue
              </Text>
              <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
                {error}
              </Text>
              <TouchableOpacity
                onPress={refreshData}
                style={[styles.retryButton, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.retryText, { color: colors.background }]}>
                  Retry Connection
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
        {/* Portfolio Value Card */}
        <Card style={styles.portfolioCard}>
          <View style={styles.portfolioHeader}>
            <Text style={[styles.portfolioLabel, { color: colors.textSecondary }]}>
              Portfolio Value
            </Text>
            <View style={styles.portfolioHeaderRight}>
              {isLoading && (
                <RefreshCw
                  size={16}
                  color={colors.primary}
                  style={[styles.loadingIcon, { transform: [{ rotate: '180deg' }] }]}
                />
              )}
              {totalGainLoss >= 0 ? (
                <ArrowUpRight size={20} color={colors.success} />
              ) : (
                <ArrowDownRight size={20} color={colors.error} />
              )}
            </View>
          </View>
          {isLoading ? (
            <View style={{ marginTop: 4, width: '100%' }}>
              <Skeleton width={160} height={28} borderRadius={8} style={{ marginBottom: 8 }} />
              <Skeleton width={220} height={16} borderRadius={6} />
            </View>
          ) : (
            <>
              <Text style={[styles.portfolioValue, { color: colors.text }]}>
                ₹{totalValue.toLocaleString()}
              </Text>
              <Text style={[styles.portfolioChange, {
                color: totalGainLoss >= 0 ? colors.success : colors.error
              }]}>
            {isLoading ? 'Fetching latest...' : `${totalGainLoss >= 0 ? '+' : ''}₹${Math.abs(totalGainLoss).toLocaleString()} (${totalGainLossPercent.toFixed(2)}%)`}
          </Text>
          {isRealTimeEnabled && lastUpdated && !isLoading && (
            <Text style={[styles.lastUpdatedSmall, { color: colors.textSecondary }]}>
              Updated: {lastUpdated.toLocaleTimeString()}
            </Text>
          )}
            </>
          )}
          {!isRealTimeEnabled && (
            <Text style={[styles.offlineIndicator, { color: colors.textSecondary }]}>
              📱 Offline Mode - Tap refresh to reconnect
            </Text>
          )}
        </Card>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {/* Total Profit/Loss */}
          <Card style={[styles.statCard, { flex: 1, marginRight: 8 }]}>
            <View style={styles.statHeader}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Total Profit/Loss
              </Text>
              <TrendingUp size={16} color={colors.success} />
            </View>
            <Text style={[styles.statValue, {
              color: totalGainLoss >= 0 ? colors.success : colors.error
            }]}>
              {totalGainLoss >= 0 ? '+' : ''}₹{Math.abs(totalGainLoss).toLocaleString()}
            </Text>
            <Text style={[styles.statSubtext, { color: colors.textSecondary }]}>
              {totalGainLoss >= 0 ? 'Overall gains' : 'Overall losses'}
            </Text>
          </Card>

          {/* Day's Change */}
          <Card style={[styles.statCard, { flex: 1, marginLeft: 8 }]}>
            <View style={styles.statHeader}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Day's Change
              </Text>
              <ArrowUpRight size={16} color={colors.success} />
            </View>
            <Text style={[styles.statValue, {
              color: portfolioChange >= 0 ? colors.success : colors.error
            }]}>
              {portfolioChange >= 0 ? '+' : ''}₹{Math.abs(portfolioChange).toFixed(2)}
            </Text>
            <Text style={[styles.statSubtext, { color: colors.textSecondary }]}>
              {portfolioChangePercent >= 0 ? '+' : ''}{portfolioChangePercent.toFixed(2)}% today
            </Text>
          </Card>
        </View>

        {/* Portfolio Performance Chart */}
        <Card style={styles.chartCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Portfolio Performance
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Your portfolio value over the last 6 months.
          </Text>
          <View style={styles.chartContainer}>
            {isLoading ? (
              <View style={{ width: screenWidth - 64 }}>
                <Skeleton width={screenWidth - 64} height={20} borderRadius={8} style={{ marginBottom: 12 }} />
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} width={(screenWidth - 64) / 10} height={60 + i * 10} borderRadius={6} />
                  ))}
                </View>
              </View>
            ) : (
              <BarChart
                data={chartData}
                width={screenWidth - 64} // Account for padding
                height={isTablet ? 280 : 220}
                chartConfig={chartConfig}
                style={styles.chart}
                showValuesOnTopOfBars={false}
                fromZero={false}
                withInnerLines={true}
                yAxisSuffix=""
                yAxisLabel=""
                yAxisInterval={1}
              />
            )}
          </View>
        </Card>

        {/* Recent Transactions */}
        <Card style={styles.recentTransactions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Transactions
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            A log of your recent investment activities.
          </Text>

          {/* Transaction Header */}
          <View style={styles.transactionHeader}>
            <Text style={[styles.headerText, { color: colors.textSecondary }]}>Stock</Text>
            <Text style={[styles.headerText, { color: colors.textSecondary }]}>Type</Text>
            <Text style={[styles.headerText, { color: colors.textSecondary }]}>Amount</Text>
          </View>

          {/* Transaction List */}
          {isLoading ? (
            <View style={styles.loadingTransactions}>
              {/* Skeleton rows */}
              <View style={{ width: '100%', gap: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <View style={{ height: 14, borderRadius: 6, backgroundColor: colors.text + '10', marginBottom: 6 }} />
                    <View style={{ height: 10, borderRadius: 6, backgroundColor: colors.text + '10', width: '60%' }} />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 8 }}>
                    <View style={{ height: 12, borderRadius: 6, backgroundColor: colors.text + '10' }} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <View style={{ height: 12, borderRadius: 6, backgroundColor: colors.text + '10' }} />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <View style={{ height: 14, borderRadius: 6, backgroundColor: colors.text + '10', marginBottom: 6 }} />
                    <View style={{ height: 10, borderRadius: 6, backgroundColor: colors.text + '10', width: '50%' }} />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 8 }}>
                    <View style={{ height: 12, borderRadius: 6, backgroundColor: colors.text + '10' }} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <View style={{ height: 12, borderRadius: 6, backgroundColor: colors.text + '10' }} />
                  </View>
                </View>
              </View>
            </View>
          ) : recentTransactions.length > 0 ? (
            recentTransactions.map((transaction, index) => (
              <View key={index} style={[styles.transactionItem, { borderBottomColor: colors.border }]}>
                <View style={styles.transactionLeft}>
                  <Text style={[styles.stockSymbol, { color: colors.text }]}>
                    {transaction.stock}
                  </Text>
                  <Text style={[styles.stockName, { color: colors.textSecondary }]}>
                    {investments.find(inv => inv.ticker === transaction.stock)?.name || 'Stock'}
                  </Text>
                </View>
                <View style={[
                  styles.transactionType,
                  { backgroundColor: transaction.color + '20' }
                ]}>
                  <Text style={[styles.typeText, { color: transaction.color }]}>
                    {transaction.type}
                  </Text>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={[styles.transactionAmount, { color: colors.text }]}>
                    ₹{transaction.amount.toLocaleString()}
                  </Text>
                  <Text style={[styles.transactionTime, { color: colors.textSecondary }]}>
                    Today
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyTransactions}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No recent transactions
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Your investment activity will appear here
              </Text>
            </View>
          )}
        </Card>
        </View>
      </ScrollView>
    </View>
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
    paddingBottom: 24, // Reduced padding since we removed the tab bar
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  errorText: {
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 8,
  },
  statusIcon: {
    marginLeft: 12,
  },
  portfolioCard: {
    padding: 20,
    marginBottom: 16,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  portfolioLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  portfolioValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  portfolioChange: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statCard: {
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 12,
  },
  chartCard: {
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  recentTransactions: {
    padding: 20,
    marginBottom: 24,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'left',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  transactionType: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  errorCard: {
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },
  lastUpdated: {
    fontSize: 12,
  },
  lastUpdatedSmall: {
    fontSize: 10,
    marginTop: 4,
  },

  // Enhanced styles for better UX
  errorContent: {
    alignItems: 'center',
    padding: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '500',
  },

  portfolioHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingIcon: {
    marginRight: 4,
  },
  offlineIndicator: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },

  // Enhanced transaction styles
  loadingTransactions: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  transactionLeft: {
    flex: 1,
  },
  stockName: {
    fontSize: 12,
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionTime: {
    fontSize: 11,
    marginTop: 2,
  },
  emptyTransactions: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
