import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SettingsHeader } from '@/components/SettingsHeader';
import { Moon, Sun, CreditCard, DollarSign, Plus, MoreVertical } from 'lucide-react-native';

export default function SettingsScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  
  // Form state
  const [fullName, setFullName] = useState(user?.fullName || 'WealthLens User');
  const [email, setEmail] = useState(user?.email || 'user@wealthlens.com');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleSaveChanges = () => {
    Alert.alert('Success', 'Profile information updated successfully!');
  };

  const handleSendMessage = () => {
    if (!subject || !message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    Alert.alert('Message Sent', 'We will get back to you soon!');
    setSubject('');
    setMessage('');
  };

  const handleAddAccount = () => {
    Alert.alert('Add Account', 'This feature will be available soon!');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SettingsHeader title="Settings" />
      <ScrollView style={styles.scrollView}>
        {/* Linked Bank Accounts */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Linked Bank Accounts
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                Manage the bank accounts connected to WealthLens.
              </Text>
            </View>
          </View>
          
          {/* Floating Add Account Button */}
          <TouchableOpacity
            onPress={handleAddAccount}
            style={[styles.floatingAddButton, { backgroundColor: colors.primary }]}
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>

          {/* Main Checking Account */}
          <View style={[styles.accountCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.accountInfo}>
              <View style={styles.bankIconContainer}>
                <CreditCard size={24} color={colors.primary} />
              </View>
              <View style={styles.accountDetails}>
                <View style={styles.accountNameRow}>
                  <Text style={[styles.accountName, { color: colors.text }]}>
                    Main Checking Account
                  </Text>
                </View>
                <Text style={[styles.accountLabel, { color: colors.primary }]}>
                  (Primary)
                </Text>
                <Text style={[styles.accountNumber, { color: colors.textSecondary }]}>
                  **** **** **** 1234
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <MoreVertical size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Savings Account */}
          <View style={[styles.accountCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.accountInfo}>
              <View style={styles.bankIconContainer}>
                <DollarSign size={24} color={colors.primary} />
              </View>
              <View style={styles.accountDetails}>
                <Text style={[styles.accountName, { color: colors.text }]}>
                  Savings Account
                </Text>
                <Text style={[styles.accountNumber, { color: colors.textSecondary }]}>
                  **** **** **** 5678
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <MoreVertical size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Profile Settings */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Profile Settings
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Update your personal information.
          </Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.surface, 
                borderColor: colors.border,
                color: colors.text
              }]}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your full name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.surface, 
                borderColor: colors.border,
                color: colors.text
              }]}
              value={email}
              onChangeText={setEmail}
              placeholder="Your email address"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
            />
          </View>

          <Button
            title="Save Changes"
            variant="primary"
            onPress={handleSaveChanges}
            style={styles.saveButton}
          />
        </Card>

        {/* Contact Us */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Contact Us
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Have questions? We are here to help.
          </Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Subject</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.surface, 
                borderColor: colors.border,
                color: colors.text
              }]}
              value={subject}
              onChangeText={setSubject}
              placeholder="e.g., Issue with transaction"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Message</Text>
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: colors.surface, 
                borderColor: colors.border,
                color: colors.text
              }]}
              value={message}
              onChangeText={setMessage}
              placeholder="Please describe your issue or question..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <Button
            title="Send Message"
            variant="primary"
            onPress={handleSendMessage}
            style={styles.sendButton}
          />
        </Card>

        {/* App Settings */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            App Settings
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Customize your app experience.
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              {theme === 'light' ? (
                <Moon size={20} color={colors.textSecondary} />
              ) : (
                <Sun size={20} color={colors.textSecondary} />
              )}
              <Text style={[styles.settingText, { color: colors.text }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>

          <Button
            title="Logout"
            variant="outline"
            onPress={handleLogout}
            style={[styles.logoutButton, { borderColor: colors.error }]}
            textStyle={{ color: colors.error }}
          />
        </Card>
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
    padding: 16,
  },
  section: {
    marginBottom: 16,
    padding: 20,
    position: 'relative', // For absolute positioning of the add button
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    position: 'relative',
  },
  sectionTitleContainer: {
    flex: 1,
    paddingRight: 40, // Make space for the floating button
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  floatingAddButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1,
  },
  accountCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bankIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountDetails: {
    flex: 1,
  },
  accountNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  accountLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 14,
  },
  moreButton: {
    padding: 8,
    marginLeft: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  saveButton: {
    marginTop: 8,
  },
  sendButton: {
    marginTop: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    marginTop: 16,
  },
});