// Real-time status component to show connection and data status
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react-native';

interface RealTimeStatusProps {
  compact?: boolean;
}

export const RealTimeStatus: React.FC<RealTimeStatusProps> = ({ compact = false }) => {
  const { colors } = useTheme();
  const { 
    isRealTimeEnabled, 
    isLoading, 
    lastUpdated, 
    error, 
    refreshData, 
    toggleRealTime, 
    clearError 
  } = useData();

  const getStatusColor = () => {
    if (error) return colors.error;
    if (isRealTimeEnabled) return colors.success;
    return colors.textSecondary;
  };

  const getStatusIcon = () => {
    if (error) return AlertCircle;
    if (isRealTimeEnabled) return CheckCircle;
    return WifiOff;
  };

  const getStatusText = () => {
    if (error) return 'Connection Error';
    if (isRealTimeEnabled) return 'Real-time Active';
    return 'Offline Mode';
  };

  const StatusIcon = getStatusIcon();

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <TouchableOpacity onPress={refreshData} disabled={isLoading}>
          <RefreshCw 
            size={16} 
            color={isLoading ? colors.textSecondary : colors.primary}
            style={isLoading ? { transform: [{ rotate: '180deg' }] } : {}}
          />
        </TouchableOpacity>
        <StatusIcon size={14} color={getStatusColor()} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.statusRow}>
        <View style={styles.statusInfo}>
          <StatusIcon size={20} color={getStatusColor()} />
          <View style={styles.statusText}>
            <Text style={[styles.statusTitle, { color: colors.text }]}>
              {getStatusText()}
            </Text>
            {lastUpdated && (
              <Text style={[styles.statusSubtitle, { color: colors.textSecondary }]}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Text>
            )}
            {error && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {error}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            onPress={refreshData} 
            disabled={isLoading}
            style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
          >
            <RefreshCw 
              size={16} 
              color={colors.primary}
              style={isLoading ? { transform: [{ rotate: '180deg' }] } : {}}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={toggleRealTime}
            style={[styles.actionButton, { 
              backgroundColor: isRealTimeEnabled ? colors.success + '20' : colors.textSecondary + '20' 
            }]}
          >
            {isRealTimeEnabled ? (
              <Wifi size={16} color={colors.success} />
            ) : (
              <WifiOff size={16} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
          
          {error && (
            <TouchableOpacity 
              onPress={clearError}
              style={[styles.actionButton, { backgroundColor: colors.error + '20' }]}
            >
              <Text style={[styles.clearErrorText, { color: colors.error }]}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Data Quality Indicators */}
      <View style={styles.indicators}>
        <View style={styles.indicator}>
          <View style={[styles.indicatorDot, { 
            backgroundColor: isRealTimeEnabled ? colors.success : colors.textSecondary 
          }]} />
          <Text style={[styles.indicatorText, { color: colors.textSecondary }]}>
            Real-time Data
          </Text>
        </View>
        
        <View style={styles.indicator}>
          <View style={[styles.indicatorDot, { 
            backgroundColor: !error ? colors.success : colors.error 
          }]} />
          <Text style={[styles.indicatorText, { color: colors.textSecondary }]}>
            Backend Connection
          </Text>
        </View>
        
        <View style={styles.indicator}>
          <View style={[styles.indicatorDot, { 
            backgroundColor: lastUpdated ? colors.success : colors.textSecondary 
          }]} />
          <Text style={[styles.indicatorText, { color: colors.textSecondary }]}>
            Data Freshness
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusText: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  statusSubtitle: {
    fontSize: 12,
  },
  errorText: {
    fontSize: 12,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearErrorText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  indicatorText: {
    fontSize: 11,
    flex: 1,
  },
});
