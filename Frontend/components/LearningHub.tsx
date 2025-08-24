import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

const LearningHub = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Learning Hub</Text>
        <Text style={styles.subHeader}>Your guide to mastering the stock market.</Text>
      </View>
    </ScrollView>
  );
};

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    padding: 24,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'Sora_700Bold',
  },
  subHeader: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Sora_400Regular',
  },
});

export default LearningHub;
