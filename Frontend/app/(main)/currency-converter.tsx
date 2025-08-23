import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Card } from '@/components/Card';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ChevronRight,
  ArrowUpDown,
  Clock
} from 'lucide-react-native';
import { exchangeRateService, POPULAR_CURRENCIES } from '@/services/exchangeRateService';

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: Date;
}

export default function CurrencyConverterScreen() {
  const { colors } = useTheme();
  const { isSmall, isTablet } = useResponsive();
  
  const [fromCurrency, setFromCurrency] = useState<Currency>(POPULAR_CURRENCIES[0]); // USD
  const [toCurrency, setToCurrency] = useState<Currency>(POPULAR_CURRENCIES[4]); // INR
  const [amount, setAmount] = useState('1.0');
  const [convertedAmount, setConvertedAmount] = useState('83.5400');
  const [exchangeRate, setExchangeRate] = useState(83.5400);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock historical data for chart
  const chartData = [
    { date: 'Jul 19', value: 83.12 },
    { date: 'Jul 23', value: 83.45 },
    { date: 'Jul 28', value: 83.28 },
    { date: 'Aug 1', value: 83.67 },
    { date: 'Aug 5', value: 83.54 },
    { date: 'Aug 9', value: 83.71 },
    { date: 'Aug 15', value: 83.54 },
  ];

  useEffect(() => {
    calculateConversion();
  }, [amount, fromCurrency, toCurrency]);

  const calculateConversion = async () => {
    const numAmount = parseFloat(amount) || 0;

    try {
      const result = await exchangeRateService.convertCurrency(
        numAmount,
        fromCurrency.code,
        toCurrency.code
      );

      setExchangeRate(result.rate);
      setConvertedAmount(result.convertedAmount.toFixed(4));
      setLastUpdated(result.timestamp);
    } catch (error) {
      console.error('Conversion failed:', error);
      Alert.alert('Error', 'Failed to convert currency. Please try again.');
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);

    try {
      // Clear cache and fetch fresh rates
      exchangeRateService.clearCache();
      await calculateConversion();
      Alert.alert('Success', 'Exchange rates updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update exchange rates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const CurrencyDropdown = ({ 
    currency, 
    onSelect, 
    isOpen, 
    onToggle 
  }: { 
    currency: Currency; 
    onSelect: (currency: Currency) => void; 
    isOpen: boolean; 
    onToggle: () => void; 
  }) => (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={[
          styles.currencySelector,
          { 
            backgroundColor: colors.surface, 
            borderColor: isOpen ? colors.primary : colors.border 
          }
        ]}
        onPress={onToggle}
      >
        <Text style={[styles.currencyText, { color: colors.text }]}>
          {currency.name}
        </Text>
        <ChevronRight
          size={20}
          color={colors.textSecondary}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />
      </TouchableOpacity>
      
      {isOpen && (
        <View style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
            {POPULAR_CURRENCIES.map((curr) => (
              <TouchableOpacity
                key={curr.code}
                style={[
                  styles.dropdownItem,
                  currency.code === curr.code && { backgroundColor: colors.primary + '15' }
                ]}
                onPress={() => {
                  onSelect(curr);
                  onToggle();
                }}
              >
                <Text style={[styles.currencyCode, { color: colors.text }]}>
                  {curr.code}
                </Text>
                <Text style={[styles.currencyName, { color: colors.textSecondary }]}>
                  {curr.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const SimpleChart = () => {
    const maxValue = Math.max(...chartData.map(d => d.value));
    const minValue = Math.min(...chartData.map(d => d.value));
    const range = maxValue - minValue;
    
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartYAxis}>
          <Text style={[styles.chartLabel, { color: colors.textSecondary }]}>
            {maxValue.toFixed(1)}
          </Text>
          <Text style={[styles.chartLabel, { color: colors.textSecondary }]}>
            {((maxValue + minValue) / 2).toFixed(1)}
          </Text>
          <Text style={[styles.chartLabel, { color: colors.textSecondary }]}>
            {minValue.toFixed(1)}
          </Text>
        </View>
        
        <View style={styles.chartArea}>
          <View style={[styles.chartBackground, { backgroundColor: colors.primary + '20' }]}>
            {/* Simple area chart representation */}
            <View style={[styles.chartLine, { backgroundColor: colors.primary }]} />
          </View>
          
          <View style={styles.chartXAxis}>
            {chartData.map((point, index) => (
              <Text key={index} style={[styles.chartXLabel, { color: colors.textSecondary }]}>
                {point.date}
              </Text>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Currency Converter
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Check the latest foreign exchange rates.
          </Text>
        </View>

        {/* Main Converter Card */}
        <Card style={styles.converterCard}>
          {/* Exchange Rate Display */}
          <View style={styles.rateDisplay}>
            <Text style={[styles.rateText, { color: colors.textSecondary }]}>
              {amount} {fromCurrency.code} equals
            </Text>
            <Text style={[styles.convertedValue, { color: colors.text }]}>
              {convertedAmount} {toCurrency.code}
            </Text>
            <View style={styles.lastUpdated}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={[styles.lastUpdatedText, { color: colors.textSecondary }]}>
                Last updated {lastUpdated.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Amount Input */}
          <View style={styles.inputSection}>
            <TextInput
              style={[
                styles.amountInput,
                { 
                  backgroundColor: colors.background, 
                  borderColor: colors.border,
                  color: colors.text 
                }
              ]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Currency Selectors */}
          <View style={styles.currencySection}>
            <CurrencyDropdown
              currency={fromCurrency}
              onSelect={setFromCurrency}
              isOpen={showFromDropdown}
              onToggle={() => {
                setShowFromDropdown(!showFromDropdown);
                setShowToDropdown(false);
              }}
            />
            
            <TouchableOpacity
              style={[styles.swapButton, { backgroundColor: colors.primary }]}
              onPress={handleSwapCurrencies}
            >
              <ArrowUpDown size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Converted Amount Display */}
          <View style={styles.resultSection}>
            <Text style={[
              styles.resultAmount,
              { 
                backgroundColor: colors.background, 
                borderColor: colors.border,
                color: colors.text 
              }
            ]}>
              {convertedAmount}
            </Text>
            
            <CurrencyDropdown
              currency={toCurrency}
              onSelect={setToCurrency}
              isOpen={showToDropdown}
              onToggle={() => {
                setShowToDropdown(!showToDropdown);
                setShowFromDropdown(false);
              }}
            />
          </View>

          {/* Chart */}
          <View style={styles.chartSection}>
            <SimpleChart />
          </View>

          {/* Refresh Button */}
          <TouchableOpacity
            style={[styles.refreshButton, { backgroundColor: colors.primary }]}
            onPress={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw 
              size={20} 
              color="#FFFFFF" 
              style={{ transform: [{ rotate: isLoading ? '180deg' : '0deg' }] }}
            />
            <Text style={styles.refreshText}>
              {isLoading ? 'Updating...' : 'Refresh Rates'}
            </Text>
          </TouchableOpacity>
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
  header: {
    marginBottom: 24,
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
  converterCard: {
    padding: 24,
  },
  rateDisplay: {
    alignItems: 'center',
    marginBottom: 32,
  },
  rateText: {
    fontSize: 16,
    marginBottom: 8,
  },
  convertedValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lastUpdated: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lastUpdatedText: {
    fontSize: 12,
  },
  inputSection: {
    marginBottom: 20,
  },
  amountInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    textAlign: 'center',
  },
  currencySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  swapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultSection: {
    marginBottom: 32,
  },
  resultAmount: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  dropdownContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 1000,
  },
  currencySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1001,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
  },
  currencyName: {
    fontSize: 14,
  },
  chartSection: {
    marginBottom: 24,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 150,
    marginVertical: 16,
  },
  chartYAxis: {
    width: 40,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  chartLabel: {
    fontSize: 10,
  },
  chartArea: {
    flex: 1,
  },
  chartBackground: {
    flex: 1,
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  chartLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  chartXAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartXLabel: {
    fontSize: 10,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  refreshText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
