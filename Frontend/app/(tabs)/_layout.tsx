import React from 'react';
import { View, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { FloatingChatButton } from '@/components/FloatingChatButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Chrome as Dashboard,
  TrendingUp,
  CreditCard,
  PieChart,
  Target,
  BookOpen
} from 'lucide-react-native';

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // Calculate tab bar height based on device
  const tabBarHeight = Platform.OS === 'ios'
    ? 80 + insets.bottom
    : 70;

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: tabBarHeight,
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
            paddingTop: 8,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarShowLabel: false, // Hide text labels, show only icons
          tabBarIconStyle: {
            marginTop: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '', // Remove title for icon-only display
            tabBarIcon: ({ color, size, focused }) => (
              <Dashboard size={focused ? 28 : 24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="investments"
          options={{
            title: '',
            tabBarIcon: ({ color, size, focused }) => (
              <TrendingUp size={focused ? 28 : 24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: '',
            tabBarIcon: ({ color, size, focused }) => (
              <CreditCard size={focused ? 28 : 24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            title: '',
            tabBarIcon: ({ color, size, focused }) => (
              <PieChart size={focused ? 28 : 24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            title: '',
            tabBarIcon: ({ color, size, focused }) => (
              <Target size={focused ? 28 : 24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="learning-hub"
          options={{
            title: '',
            tabBarIcon: ({ color, size, focused }) => (
              <BookOpen size={focused ? 28 : 24} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* Floating Chat Button */}
      <FloatingChatButton />
    </>
  );
}
