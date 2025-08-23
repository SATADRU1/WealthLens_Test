import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, SafeAreaView, RefreshControl } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useData, useInvestments } from '@/contexts/DataContext';
import { stockDataService } from '@/services/stockDataService';
import { useResponsive, getResponsiveFontSize, getResponsivePadding } from '@/hooks/useResponsive';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { Search, Filter, TrendingUp, TrendingDown, PieChart, Target, CreditCard, RefreshCw, Star } from 'lucide-react-native';

export default function InvestmentsScreen() {
  const { colors } = useTheme();
  const { isSmall, isMedium, isTablet, isDesktop } = useResponsive();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [liveOpportunities, setLiveOpportunities] = useState<any[]>([]);
  const [marketMovers, setMarketMovers] = useState<{ gainers: any[]; losers: any[] }>({ gainers: [], losers: [] });
  const [opportunitiesLoading, setOpportunitiesLoading] = useState(false);

  // Real-time data hooks
  const { isLoading, refreshData } = useData();
  const {
    investments,
    totalValue,
    totalPurchaseValue,
    totalGainLoss,
    totalGainLossPercent
  } = useInvestments();

  const styles = createStyles(isTablet, isDesktop);

  // Load live opportunities on component mount
  useEffect(() => {
    loadLiveOpportunities();
    loadMarketMovers();
  }, []);

  const loadLiveOpportunities = async () => {
    setOpportunitiesLoading(true);
    try {
      const opportunities = await stockDataService.getLiveOpportunities(10);
      setLiveOpportunities(opportunities);
    } catch (error) {
      console.error('Error loading live opportunities:', error);
    } finally {
      setOpportunitiesLoading(false);
    }
  };

  const loadMarketMovers = async () => {
    try {
      const movers = await stockDataService.getMarketMovers();
      setMarketMovers(movers);
    } catch (error) {
      console.error('Error loading market movers:', error);
    }
  };

  const handleRefreshOpportunities = async () => {
    await Promise.all([
      loadLiveOpportunities(),
      loadMarketMovers(),
      refreshData()
    ]);
  };

  // Calculate investment breakdown from real data
  const stocksValue = investments.filter(inv => inv.type === 'stock').reduce((sum, inv) => sum + inv.currentValue, 0);
  const mutualFundsValue = investments.filter(inv => inv.type === 'mutual-fund').reduce((sum, inv) => sum + inv.currentValue, 0);
  const otherValue = totalValue - stocksValue - mutualFundsValue;

  const investmentBreakdown = [
    {
      title: 'Stocks',
      amount: stocksValue,
      icon: TrendingUp,
      color: colors.primary,
      percentage: totalValue > 0 ? (stocksValue / totalValue) * 100 : 0,
    },
    {
      title: 'Mutual Funds',
      amount: mutualFundsValue,
      icon: Target,
      color: colors.accent,
      percentage: totalValue > 0 ? (mutualFundsValue / totalValue) * 100 : 0,
    },
    {
      title: 'Other',
      amount: otherValue,
      icon: CreditCard,
      color: colors.success,
      percentage: totalValue > 0 ? (otherValue / totalValue) * 100 : 0,
    },
  ];

  // Investment opportunities data
  const investmentOpportunities = [
    { ticker: 'RELIANCE.NS', name: 'Reliance Industries', price: 2850.55 },
    { ticker: 'TCS.NS', name: 'Tata Consultancy', price: 3855.70 },
    { ticker: 'HDFCBANK.NS', name: 'HDFC Bank Ltd.', price: 1680.25 },
    { ticker: 'INFY.NS', name: 'Infosys Ltd.', price: 1640.80 },
    { ticker: 'ICICIBANK.NS', name: 'ICICI Bank Ltd.', price: 1125.10 },
    { ticker: 'BHARTIARTL.NS', name: 'Bharti Airtel Ltd.', price: 1410.00 },
    { ticker: 'SBIN.NS', name: 'State Bank of India', price: 835.50 },
    { ticker: 'NIFTYBEES.NS', name: 'Nifty 50 ETF', price: 250.30 },
  ];

  const filteredOpportunities = investmentOpportunities.filter(stock =>
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter user's investments based on search and tab
  const filteredInvestments = investments.filter(investment => {
    const matchesSearch = investment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         investment.ticker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || investment.type === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="My Investments"
        rightComponent={
          <TouchableOpacity onPress={handleRefreshOpportunities} disabled={isLoading || opportunitiesLoading}>
            <RefreshCw
              size={20}
              color={isLoading || opportunitiesLoading ? colors.textSecondary : colors.primary}
              style={isLoading || opportunitiesLoading ? { transform: [{ rotate: '180deg' }] } : {}}
            />
          </TouchableOpacity>
        }
      />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isLoading || opportunitiesLoading}
            onRefresh={handleRefreshOpportunities}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.content}>
        {/* Investment Breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Portfolio Overview
          </Text>
          <View style={styles.breakdownGrid}>
            {investmentBreakdown.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Card key={index} style={styles.breakdownCard}>
                  <View style={styles.breakdownHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                      <IconComponent size={24} color={item.color} />
                    </View>
                    <Text style={[styles.breakdownPercentage, { color: colors.textSecondary }]}>
                      {item.percentage.toFixed(1)}%
                    </Text>
                  </View>
                  <Text style={[styles.breakdownTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.breakdownAmount, { color: colors.text }]}>
                    ${item.amount.toLocaleString()}
                  </Text>
                </Card>
              );
            })}
          </View>
        </View>

        {/* Current Holdings */}
        <Card style={styles.holdingsCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Current Holdings
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Your current investment positions with real-time prices.
          </Text>

          {/* Filter Tabs */}
          <View style={styles.tabContainer}>
            {['All', 'Stock', 'Mutual-fund'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  { backgroundColor: activeTab === tab ? colors.primary : colors.surface },
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: activeTab === tab ? 'white' : colors.textSecondary },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Holdings List */}
          {filteredInvestments.map((investment, index) => (
            <TouchableOpacity
              key={investment.id}
              style={[styles.holdingRow, { borderBottomColor: colors.border }]}
            >
              <View style={styles.holdingInfo}>
                <Text style={[styles.holdingTicker, { color: colors.text }]}>
                  {investment.ticker}
                </Text>
                <Text style={[styles.holdingName, { color: colors.textSecondary }]}>
                  {investment.name}
                </Text>
                <Text style={[styles.holdingQuantity, { color: colors.textSecondary }]}>
                  {investment.quantity} shares
                </Text>
              </View>
              <View style={styles.holdingValues}>
                <Text style={[styles.holdingPrice, { color: colors.text }]}>
                  ${investment.price.toFixed(2)}
                </Text>
                <Text style={[
                  styles.holdingChange,
                  { color: investment.change >= 0 ? colors.success : colors.error }
                ]}>
                  {investment.change >= 0 ? '+' : ''}${investment.change.toFixed(2)} ({investment.changePercent.toFixed(2)}%)
                </Text>
                <Text style={[styles.holdingValue, { color: colors.text }]}>
                  ${investment.currentValue.toLocaleString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Live Investment Opportunities */}
        <Card style={styles.opportunitiesCard}>
          <View style={styles.opportunitiesHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                🔥 Live Investment Opportunities
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                Real-time prices powered by yfinance
              </Text>
            </View>
            <TouchableOpacity onPress={loadLiveOpportunities} disabled={opportunitiesLoading}>
              <RefreshCw
                size={16}
                color={opportunitiesLoading ? colors.textSecondary : colors.primary}
                style={opportunitiesLoading ? { transform: [{ rotate: '180deg' }] } : {}}
              />
            </TouchableOpacity>
          </View>

          {/* Market Movers */}
          {(marketMovers.gainers.length > 0 || marketMovers.losers.length > 0) && (
            <View style={styles.marketMoversSection}>
              <Text style={[styles.subsectionTitle, { color: colors.text }]}>
                📈 Market Movers
              </Text>

              <View style={styles.moversContainer}>
                {/* Top Gainers */}
                {marketMovers.gainers.length > 0 && (
                  <View style={styles.moversList}>
                    <Text style={[styles.moversTitle, { color: colors.success }]}>
                      🟢 Top Gainers
                    </Text>
                    {marketMovers.gainers.slice(0, 3).map((stock, index) => (
                      <View key={stock.symbol} style={styles.moverItem}>
                        <Text style={[styles.moverSymbol, { color: colors.text }]}>
                          {stock.symbol}
                        </Text>
                        <Text style={[styles.moverChange, { color: colors.success }]}>
                          +{stock.change_percent.toFixed(2)}%
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Top Losers */}
                {marketMovers.losers.length > 0 && (
                  <View style={styles.moversList}>
                    <Text style={[styles.moversTitle, { color: colors.error }]}>
                      🔴 Top Losers
                    </Text>
                    {marketMovers.losers.slice(0, 3).map((stock, index) => (
                      <View key={stock.symbol} style={styles.moverItem}>
                        <Text style={[styles.moverSymbol, { color: colors.text }]}>
                          {stock.symbol}
                        </Text>
                        <Text style={[styles.moverChange, { color: colors.error }]}>
                          {stock.change_percent.toFixed(2)}%
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Live Opportunities List */}
          <View style={styles.opportunitiesList}>
            <Text style={[styles.subsectionTitle, { color: colors.text }]}>
              ⭐ Trending Stocks
            </Text>

            {opportunitiesLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                  Loading live prices...
                </Text>
              </View>
            ) : liveOpportunities.length > 0 ? (
              liveOpportunities.map((stock, index) => (
                <TouchableOpacity
                  key={stock.symbol}
                  style={[styles.opportunityItem, { borderBottomColor: colors.border }]}
                >
                  <View style={styles.opportunityInfo}>
                    <Text style={[styles.opportunitySymbol, { color: colors.text }]}>
                      {stock.symbol}
                    </Text>
                    <Text style={[styles.opportunityName, { color: colors.textSecondary }]}>
                      {stock.name}
                    </Text>
                  </View>
                  <View style={styles.opportunityValues}>
                    <Text style={[styles.opportunityPrice, { color: colors.text }]}>
                      ${stock.current_price.toFixed(2)}
                    </Text>
                    <Text style={[
                      styles.opportunityChange,
                      { color: stock.change >= 0 ? colors.success : colors.error }
                    ]}>
                      {stock.change >= 0 ? '+' : ''}{stock.change_percent.toFixed(2)}%
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No opportunities available. Check your connection.
                </Text>
              </View>
            )}
          </View>

          {/* Search Bar */}
          <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search by name or ticker..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Tab */}
          <TouchableOpacity style={styles.tabButton}>
            <Text style={[styles.tabText, { color: colors.primary }]}>All</Text>
          </TouchableOpacity>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { color: colors.textSecondary }]}>Ticker</Text>
            <Text style={[styles.headerText, { color: colors.textSecondary }]}>Name</Text>
            <Text style={[styles.headerText, { color: colors.textSecondary }]}>Price</Text>
          </View>

          {/* Table Rows */}
          {filteredOpportunities.map((stock, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tableRow, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.tickerText, { color: colors.text }]}>
                {stock.ticker}
              </Text>
              <Text style={[styles.nameText, { color: colors.text }]}>
                {stock.name}
              </Text>
              <Text style={[styles.priceText, { color: colors.text }]}>
                ₹{stock.price}
              </Text>
            </TouchableOpacity>
          ))}
        </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (isTablet: boolean, isDesktop: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: isTablet ? 32 : 20,
    maxWidth: isDesktop ? 1200 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  breakdownSection: {
    marginBottom: isTablet ? 32 : 24,
  },
  sectionTitle: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: isTablet ? 16 : 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  breakdownGrid: {
    flexDirection: isTablet ? 'row' : 'column',
    gap: isTablet ? 16 : 12,
    marginBottom: isTablet ? 32 : 24,
  },
  breakdownCard: {
    flex: isTablet ? 1 : undefined,
    padding: isTablet ? 20 : 16,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: isTablet ? 48 : 40,
    height: isTablet ? 48 : 40,
    borderRadius: isTablet ? 24 : 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breakdownPercentage: {
    fontSize: 12,
    fontWeight: '500',
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  breakdownAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  opportunitiesCard: {
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
  tabButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tableHeader: {
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
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  tickerText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  nameText: {
    fontSize: 14,
    flex: 1,
    paddingHorizontal: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  holdingsCard: {
    padding: isTablet ? 24 : 20,
    marginBottom: isTablet ? 32 : 24,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  holdingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  holdingInfo: {
    flex: 1,
  },
  holdingTicker: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  holdingName: {
    fontSize: 14,
    marginBottom: 2,
  },
  holdingQuantity: {
    fontSize: 12,
  },
  holdingValues: {
    alignItems: 'flex-end',
  },
  holdingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  holdingChange: {
    fontSize: 14,
    marginBottom: 2,
  },
  holdingValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  opportunitiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  marketMoversSection: {
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  moversContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  moversList: {
    flex: 1,
  },
  moversTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  moverItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  moverSymbol: {
    fontSize: 14,
    fontWeight: '500',
  },
  moverChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  opportunitiesList: {
    marginTop: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  opportunityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  opportunityInfo: {
    flex: 1,
  },
  opportunitySymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  opportunityName: {
    fontSize: 14,
  },
  opportunityValues: {
    alignItems: 'flex-end',
  },
  opportunityPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  opportunityChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
