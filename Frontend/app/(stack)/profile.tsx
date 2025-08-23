import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Profile Settings
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Welcome to your profile, {user?.fullName || 'User'}!
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            Email: {user?.email || 'No email'}
          </Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            This is a simplified profile screen for testing navigation.
          </Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    marginBottom: 8,
  },
});
