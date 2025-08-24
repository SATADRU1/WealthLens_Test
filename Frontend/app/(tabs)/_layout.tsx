import React from 'react';
import { View, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { FloatingChatButton } from '@/components/FloatingChatButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            display: 'none', // Hide the tab bar completely
          },
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="investments" />
        <Tabs.Screen name="transactions" />
        <Tabs.Screen name="expenses" />
        <Tabs.Screen name="goals" />
        <Tabs.Screen name="learning-hub" />
      </Tabs>

      {/* Floating Chat Button */}
      <FloatingChatButton />
    </>
  );
}
