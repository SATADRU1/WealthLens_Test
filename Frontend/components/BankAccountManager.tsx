import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive, getResponsiveFontSize, getResponsivePadding } from '@/hooks/useResponsive';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { X, CreditCard, Building } from 'lucide-react-native';

interface BankAccountManagerProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (account: any) => void;
}

export function BankAccountManager({ visible, onClose, onAdd }: BankAccountManagerProps) {
  const { colors } = useTheme();
  const { isSmall, isTablet } = useResponsive();

  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState('checking');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');

  const handleSubmit = () => {
    if (!bankName || !accountNumber || !routingNumber || !accountHolderName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newAccount = {
      id: Date.now().toString(),
      bankName,
      accountType,
      accountNumber: `**** **** **** ${accountNumber.slice(-4)}`,
      routingNumber,
      accountHolderName,
      balance: 0,
    };

    onAdd(newAccount);
    
    // Reset form
    setBankName('');
    setAccountNumber('');
    setRoutingNumber('');
    setAccountHolderName('');
    
    onClose();
    Alert.alert('Success', 'Bank account added successfully!');
  };

  const handleCancel = () => {
    setBankName('');
    setAccountNumber('');
    setRoutingNumber('');
    setAccountHolderName('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Add Bank Account
          </Text>
          <Button
            title=""
            onPress={handleCancel}
            variant="outline"
            style={styles.closeButton}
          >
            <X size={20} color={colors.text} />
          </Button>
        </View>

        <View style={styles.content}>
          <Card style={styles.formCard}>
            <View style={styles.iconContainer}>
              <View style={[styles.icon, { backgroundColor: colors.primary + '20' }]}>
                <CreditCard size={32} color={colors.primary} />
              </View>
              <Text style={[styles.iconText, { color: colors.text }]}>
                Link Your Bank Account
              </Text>
              <Text style={[styles.iconSubtext, { color: colors.textSecondary }]}>
                Securely connect your bank account to WealthLens
              </Text>
            </View>

            <View style={styles.form}>
              <Input
                label="Bank Name"
                value={bankName}
                onChangeText={setBankName}
                placeholder="e.g., Chase Bank"
              />

              <Input
                label="Account Holder Name"
                value={accountHolderName}
                onChangeText={setAccountHolderName}
                placeholder="Full name on account"
              />

              <Input
                label="Account Number"
                value={accountNumber}
                onChangeText={setAccountNumber}
                placeholder="Enter account number"
                keyboardType="numeric"
                secureTextEntry
              />

              <Input
                label="Routing Number"
                value={routingNumber}
                onChangeText={setRoutingNumber}
                placeholder="9-digit routing number"
                keyboardType="numeric"
              />

              <View style={styles.securityNote}>
                <View style={[styles.securityIcon, { backgroundColor: colors.success + '20' }]}>
                  <Building size={16} color={colors.success} />
                </View>
                <Text style={[styles.securityText, { color: colors.textSecondary }]}>
                  Your banking information is encrypted and secure. We use bank-level security to protect your data.
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={handleCancel}
            style={styles.footerButton}
          />
          <Button
            title="Add Account"
            onPress={handleSubmit}
            style={styles.footerButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formCard: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  iconSubtext: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: 20,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    gap: 12,
  },
  securityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  footerButton: {
    flex: 1,
  },
});
