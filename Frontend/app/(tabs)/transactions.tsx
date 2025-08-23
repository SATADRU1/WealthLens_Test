import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { mockTransactions } from '@/data/mockData';
import { 
  Send, 
  QrCode, 
  TrendingUp, 
  TrendingDown, 
  X 
} from 'lucide-react-native';

export default function TransactionsScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'pay' | 'scan'>('pay');
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleScanQR = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        return;
      }
    }
    setShowCamera(true);
  };

  const TabButton = ({ title, value }: { title: string; value: 'pay' | 'scan' }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor: activeTab === value ? colors.primary : 'transparent',
          borderBottomWidth: activeTab === value ? 2 : 0,
          borderBottomColor: colors.primary,
        },
      ]}
      onPress={() => setActiveTab(value)}
    >
      <Text
        style={[
          styles.tabButtonText,
          { color: activeTab === value ? colors.primary : colors.textSecondary },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera}>
          <View style={styles.cameraOverlay}>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.surface }]}
              onPress={() => setShowCamera(false)}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.scanArea}>
              <Text style={[styles.scanText, { color: '#FFFFFF' }]}>
                Position QR code within the frame
              </Text>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Transactions" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>

      <Card>
        <View style={styles.tabContainer}>
          <TabButton title="Pay" value="pay" />
          <TabButton title="Scan QR" value="scan" />
        </View>

        {activeTab === 'pay' && (
          <View style={styles.payContainer}>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}>
                <Send size={24} color={colors.primary} />
                <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                  Send Money
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.accent + '20' }]}>
                <QrCode size={24} color={colors.accent} />
                <Text style={[styles.actionButtonText, { color: colors.accent }]}>
                  Request Money
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'scan' && (
          <View style={styles.scanContainer}>
            <View style={styles.qrSection}>
              <QrCode size={64} color={colors.primary} />
              <Text style={[styles.qrTitle, { color: colors.text }]}>
                Scan QR Code
              </Text>
              <Text style={[styles.qrSubtitle, { color: colors.textSecondary }]}>
                Point your camera at a QR code to make a payment
              </Text>
              <Button
                title="Open Camera"
                onPress={handleScanQR}
                style={styles.scanButton}
              />
            </View>
          </View>
        )}
      </Card>

      {/* Transaction History */}
      <Card style={styles.historyCard}>
        <Text style={[styles.historyTitle, { color: colors.text }]}>
          Recent Transactions
        </Text>
        
        {mockTransactions.slice(0, 10).map((transaction, index) => {
          const isIncome = transaction.type === 'income';
          
          return (
            <View key={index} style={[styles.transactionItem, { borderBottomColor: colors.border }]}>
              <View style={styles.transactionIcon}>
                {isIncome ? (
                  <TrendingUp size={20} color={colors.success} />
                ) : (
                  <TrendingDown size={20} color={colors.error} />
                )}
              </View>
              
              <View style={styles.transactionDetails}>
                <Text style={[styles.transactionDescription, { color: colors.text }]}>
                  {transaction.description}
                </Text>
                <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>
                  {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                </Text>
              </View>
              
              <Text style={[
                styles.transactionAmount,
                { color: isIncome ? colors.success : colors.error }
              ]}>
                {isIncome ? '+' : '-'}₹{Math.abs(transaction.amount).toLocaleString()}
              </Text>
            </View>
          );
        })}
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  payContainer: {
    paddingBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scanContainer: {
    paddingBottom: 20,
  },
  qrSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  qrSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  scanButton: {
    paddingHorizontal: 32,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  historyCard: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
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
