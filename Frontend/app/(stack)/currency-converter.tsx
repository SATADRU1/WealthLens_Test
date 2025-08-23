import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Modal, Dimensions, Animated } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { ChevronDown, TrendingUp, ArrowUpDown, RefreshCw, DollarSign } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

// Mock exchange rates
const exchangeRates: Record<string, Record<string, number>> = {
  'USD': { 'INR': 83.54, 'EUR': 0.85, 'GBP': 0.73, 'JPY': 110.0 },
  'INR': { 'USD': 0.012, 'EUR': 0.010, 'GBP': 0.0087, 'JPY': 1.32 },
  'EUR': { 'USD': 1.18, 'INR': 98.45, 'GBP': 0.86, 'JPY': 129.5 },
  'GBP': { 'USD': 1.37, 'INR': 114.8, 'EUR': 1.16, 'JPY': 150.2 },
  'JPY': { 'USD': 0.0091, 'INR': 0.76, 'EUR': 0.0077, 'GBP': 0.0067 }
};

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' }
];

// Mock chart data
const chartData = [83.2, 83.1, 83.4, 83.6, 83.3, 83.5, 83.7, 83.4, 83.6, 83.5, 83.8, 83.4, 83.5];
const chartLabels = ['Jul 19', 'Jul 23', 'Jul 28', 'Aug 1', 'Aug 5', 'Aug 9', 'Aug 15'];

export default function CurrencyConverterScreen() {
  const { colors } = useTheme();
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [convertedAmount, setConvertedAmount] = useState('83.5400');
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);

  const currentRate = exchangeRates[fromCurrency]?.[toCurrency] || 1;

  // Update converted amount when amount or currencies change
  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    const converted = numAmount * currentRate;
    setConvertedAmount(converted.toFixed(4));
  }, [amount, currentRate]);

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
    setAmount(cleanValue);
  };

  const selectFromCurrency = (currency: string) => {
    setFromCurrency(currency);
    setShowFromModal(false);
  };

  const selectToCurrency = (currency: string) => {
    setToCurrency(currency);
    setShowToModal(false);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(51, 153, 230, ${opacity})`,
    labelColor: (opacity = 1) => colors.textSecondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#3399E6"
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <DollarSign size={24} color={colors.primary} />
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Currency Converter
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                Real-time exchange rates
              </Text>
            </View>
            <TouchableOpacity style={[styles.refreshButton, { backgroundColor: colors.primary + '10' }]}>
              <RefreshCw size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Converter Card */}
        <Card style={styles.converterCard}>
          {/* Current Rate Display */}
          <View style={[styles.rateDisplay, { backgroundColor: colors.primary + '08' }]}>
            <View style={styles.rateHeader}>
              <TrendingUp size={20} color={colors.success} />
              <Text style={[styles.rateLabel, { color: colors.textSecondary }]}>
                {amount} {fromCurrency} equals
              </Text>
            </View>
            <Text style={[styles.rateValue, { color: colors.primary }]}>
              {convertedAmount} {toCurrency}
            </Text>
            <View style={styles.rateInfo}>
              <Text style={[styles.exchangeRate, { color: colors.textSecondary }]}>
                1 {fromCurrency} = {currentRate.toFixed(4)} {toCurrency}
              </Text>
              <Text style={[styles.lastUpdated, { color: colors.textSecondary }]}>
                • Updated now
              </Text>
            </View>
          </View>

          {/* Converter Interface */}
          <View style={styles.converterInterface}>
            {/* From Section */}
            <View style={styles.currencySection}>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>From</Text>
              <View style={styles.inputRow}>
                <View style={[styles.amountInputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Input
                    value={amount}
                    onChangeText={handleAmountChange}
                    keyboardType="numeric"
                    placeholder="0.00"
                    style={[styles.amountInput, { color: colors.text }]}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.modernCurrencySelector, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => setShowFromModal(true)}
                >
                  <View style={styles.currencyContent}>
                    <Text style={[styles.currencyCode, { color: colors.text }]}>
                      {fromCurrency}
                    </Text>
                    <Text style={[styles.currencyName, { color: colors.textSecondary }]}>
                      {currencies.find(c => c.code === fromCurrency)?.name}
                    </Text>
                  </View>
                  <ChevronDown size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Swap Button */}
            <View style={styles.swapContainer}>
              <TouchableOpacity
                style={[styles.swapButton, { backgroundColor: colors.primary }]}
                onPress={swapCurrencies}
              >
                <ArrowUpDown size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* To Section */}
            <View style={styles.currencySection}>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>To</Text>
              <View style={styles.inputRow}>
                <View style={[styles.resultContainer, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
                  <Text style={[styles.resultAmount, { color: colors.primary }]}>
                    {convertedAmount}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.modernCurrencySelector, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => setShowToModal(true)}
                >
                  <View style={styles.currencyContent}>
                    <Text style={[styles.currencyCode, { color: colors.text }]}>
                      {toCurrency}
                    </Text>
                    <Text style={[styles.currencyName, { color: colors.textSecondary }]}>
                      {currencies.find(c => c.code === toCurrency)?.name}
                    </Text>
                  </View>
                  <ChevronDown size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Card>

        {/* Exchange Rate Chart */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleContainer}>
              <TrendingUp size={20} color={colors.primary} />
              <Text style={[styles.chartTitle, { color: colors.text }]}>
                Exchange Rate Trend
              </Text>
            </View>
            <View style={[styles.chartPeriod, { backgroundColor: colors.primary + '10' }]}>
              <Text style={[styles.chartPeriodText, { color: colors.primary }]}>
                30D
              </Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: chartLabels,
                datasets: [{
                  data: chartData,
                  color: (opacity = 1) => `rgba(51, 153, 230, ${opacity})`,
                  strokeWidth: 3
                }]
              }}
              width={screenWidth - 64}
              height={240}
              chartConfig={chartConfig}
              style={styles.chart}
              bezier
              withDots={true}
              withShadow={false}
              withInnerLines={false}
              withOuterLines={false}
            />
          </View>

          <View style={styles.chartFooter}>
            <Text style={[styles.chartDescription, { color: colors.textSecondary }]}>
              Historical exchange rate for {fromCurrency}/{toCurrency}
            </Text>
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <Text style={[styles.quickActionsTitle, { color: colors.text }]}>
            Quick Convert
          </Text>
          <View style={styles.quickActionsGrid}>
            {[1, 10, 100, 1000].map((value) => (
              <TouchableOpacity
                key={value}
                style={[styles.quickActionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => setAmount(value.toString())}
              >
                <Text style={[styles.quickActionAmount, { color: colors.text }]}>
                  {value}
                </Text>
                <Text style={[styles.quickActionCurrency, { color: colors.textSecondary }]}>
                  {fromCurrency}
                </Text>
                <Text style={[styles.quickActionResult, { color: colors.primary }]}>
                  {(value * currentRate).toFixed(2)} {toCurrency}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      </ScrollView>

      {/* From Currency Modal */}
      <Modal
        visible={showFromModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFromModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowFromModal(false)}
          />
          <View style={[styles.modernModalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Select Currency
              </Text>
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                Choose from currency
              </Text>
            </View>
            <ScrollView style={styles.currencyList} showsVerticalScrollIndicator={false}>
              {currencies.map((currency) => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.modernCurrencyOption,
                    { backgroundColor: fromCurrency === currency.code ? colors.primary + '10' : 'transparent' }
                  ]}
                  onPress={() => selectFromCurrency(currency.code)}
                >
                  <View style={[styles.currencyIcon, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.currencySymbol, { color: colors.primary }]}>
                      {currency.symbol}
                    </Text>
                  </View>
                  <View style={styles.currencyInfo}>
                    <Text style={[styles.currencyOptionName, { color: colors.text }]}>
                      {currency.name}
                    </Text>
                    <Text style={[styles.currencyOptionCode, { color: colors.textSecondary }]}>
                      {currency.code}
                    </Text>
                  </View>
                  {fromCurrency === currency.code && (
                    <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* To Currency Modal */}
      <Modal
        visible={showToModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowToModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowToModal(false)}
          />
          <View style={[styles.modernModalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Select Currency
              </Text>
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                Choose to currency
              </Text>
            </View>
            <ScrollView style={styles.currencyList} showsVerticalScrollIndicator={false}>
              {currencies.map((currency) => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.modernCurrencyOption,
                    { backgroundColor: toCurrency === currency.code ? colors.primary + '10' : 'transparent' }
                  ]}
                  onPress={() => selectToCurrency(currency.code)}
                >
                  <View style={[styles.currencyIcon, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.currencySymbol, { color: colors.primary }]}>
                      {currency.symbol}
                    </Text>
                  </View>
                  <View style={styles.currencyInfo}>
                    <Text style={[styles.currencyOptionName, { color: colors.text }]}>
                      {currency.name}
                    </Text>
                    <Text style={[styles.currencyOptionCode, { color: colors.textSecondary }]}>
                      {currency.code}
                    </Text>
                  </View>
                  {toCurrency === currency.code && (
                    <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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

  // Header Section
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Converter Card
  converterCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  rateDisplay: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  rateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rateLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  rateValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  rateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exchangeRate: {
    fontSize: 14,
    fontWeight: '500',
  },
  lastUpdated: {
    fontSize: 12,
  },

  // Converter Interface
  converterInterface: {
    gap: 16,
  },
  currencySection: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  amountInputContainer: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  amountInput: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 12,
  },
  modernCurrencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderRadius: 16,
    minWidth: 140,
  },
  currencyContent: {
    alignItems: 'center',
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  currencyName: {
    fontSize: 12,
    marginTop: 2,
  },
  swapContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  swapButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  resultContainer: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  // Chart Section
  chartCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartPeriod: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  chartPeriodText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  chartFooter: {
    alignItems: 'center',
  },
  chartDescription: {
    fontSize: 14,
    textAlign: 'center',
  },

  // Quick Actions
  quickActionsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  quickActionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickActionCurrency: {
    fontSize: 12,
  },
  quickActionResult: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modernModalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 20,
    maxHeight: '70%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  currencyList: {
    paddingHorizontal: 24,
  },
  modernCurrencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  currencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  currencyInfo: {
    flex: 1,
  },
  currencyOptionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  currencyOptionCode: {
    fontSize: 14,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
