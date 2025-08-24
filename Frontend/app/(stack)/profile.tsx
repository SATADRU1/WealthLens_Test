import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { SettingsHeader } from '@/components/SettingsHeader';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  
  // Form state
  const [fullName, setFullName] = useState(user?.fullName || 'WealthLens User');
  const [email, setEmail] = useState(user?.email || 'user@wealthlens.com');
  
  const handleSaveChanges = () => {
    Alert.alert('Success', 'Profile information updated successfully!');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <SettingsHeader title="Profile" />
      <ScrollView style={styles.scrollView}>
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
            onPress={() => Alert.alert('Message Sent', 'We will get back to you soon!')}
            style={styles.sendButton}
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
});
