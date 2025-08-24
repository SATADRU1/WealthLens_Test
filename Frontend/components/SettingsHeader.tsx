import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { ChevronLeft, Bell } from 'lucide-react-native';

interface SettingsHeaderProps {
  title?: string;
  showBack?: boolean;
  showNotification?: boolean;
  onBackPress?: () => void;
}

export function SettingsHeader({
  title,
  showBack = true,
  showNotification = true,
  onBackPress,
}: SettingsHeaderProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.surface}
      />
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          {showBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          )}
          
          <View style={styles.titleContainer}>
            {title && (
              <Text style={[styles.title, { color: colors.text }]}>
                {title}
              </Text>
            )}
          </View>
          
          {showNotification && (
            <TouchableOpacity
              style={styles.notificationButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Bell size={24} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    elevation: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  backButton: {
    padding: 4,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Sora_600SemiBold',
  },
  notificationButton: {
    padding: 4,
  },
});