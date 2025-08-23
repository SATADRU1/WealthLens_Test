import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Sidebar } from '@/components/Sidebar';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { Menu } from 'lucide-react-native';

export default function MainLayout() {
  const { colors } = useTheme();
  const { isSmall, isTablet } = useResponsive();
  const [sidebarOpen, setSidebarOpen] = useState(!isSmall); // Open by default on larger screens

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main Content Area */}
      <View style={[
        styles.mainContent,
        {
          marginLeft: sidebarOpen && !isSmall ? (isTablet ? 320 : 280) : 0,
        }
      ]}>
        <Stack
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.surface,
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerLeft: () => (
              <TouchableOpacity
                onPress={toggleSidebar}
                style={styles.menuButton}
              >
                <Menu size={24} color={colors.text} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <View style={styles.headerRight}>
                <ProfileDropdown />
              </View>
            ),
          }}
        >
          <Stack.Screen 
            name="dashboard" 
            options={{ 
              title: 'Dashboard',
              headerLeft: () => (
                <TouchableOpacity
                  onPress={toggleSidebar}
                  style={styles.menuButton}
                >
                  <Menu size={24} color={colors.text} />
                </TouchableOpacity>
              ),
            }} 
          />
          <Stack.Screen 
            name="investments" 
            options={{ 
              title: 'Investments',
              headerLeft: () => (
                <TouchableOpacity
                  onPress={toggleSidebar}
                  style={styles.menuButton}
                >
                  <Menu size={24} color={colors.text} />
                </TouchableOpacity>
              ),
            }} 
          />
          <Stack.Screen 
            name="transactions" 
            options={{ 
              title: 'Transactions',
              headerLeft: () => (
                <TouchableOpacity
                  onPress={toggleSidebar}
                  style={styles.menuButton}
                >
                  <Menu size={24} color={colors.text} />
                </TouchableOpacity>
              ),
            }} 
          />
          <Stack.Screen 
            name="expenses" 
            options={{ 
              title: 'Expenses',
              headerLeft: () => (
                <TouchableOpacity
                  onPress={toggleSidebar}
                  style={styles.menuButton}
                >
                  <Menu size={24} color={colors.text} />
                </TouchableOpacity>
              ),
            }} 
          />
          <Stack.Screen 
            name="goals" 
            options={{ 
              title: 'Goals',
              headerLeft: () => (
                <TouchableOpacity
                  onPress={toggleSidebar}
                  style={styles.menuButton}
                >
                  <Menu size={24} color={colors.text} />
                </TouchableOpacity>
              ),
            }} 
          />
          <Stack.Screen
            name="ai-finance"
            options={{
              title: 'AI Finance Tool',
              headerLeft: () => (
                <TouchableOpacity
                  onPress={toggleSidebar}
                  style={styles.menuButton}
                >
                  <Menu size={24} color={colors.text} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="currency-converter"
            options={{
              title: 'Currency Converter',
              headerLeft: () => (
                <TouchableOpacity
                  onPress={toggleSidebar}
                  style={styles.menuButton}
                >
                  <Menu size={24} color={colors.text} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="learning-hub"
            options={{
              title: 'Learning Hub',
              headerLeft: () => (
                <TouchableOpacity
                  onPress={toggleSidebar}
                  style={styles.menuButton}
                >
                  <Menu size={24} color={colors.text} />
                </TouchableOpacity>
              ),
            }}
          />
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  menuButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerRight: {
    marginRight: 16,
  },
});
