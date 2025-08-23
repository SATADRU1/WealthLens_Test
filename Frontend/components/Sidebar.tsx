import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive, getResponsiveFontSize, getResponsivePadding } from '@/hooks/useResponsive';
import {
  Menu,
  X,
  Chrome as Home,
  TrendingUp,
  CreditCard,
  ChartPie as PieChart,
  Target,
  Bot,
  MoreHorizontal,
  Settings,
  User,
  HelpCircle,
  ArrowUpDown,
  BookOpen
} from 'lucide-react-native';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavigationItem {
  id: string;
  title: string;
  icon: any;
  route: string;
  color?: string;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { isSmall, isTablet } = useResponsive();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: Home,
      route: '/(tabs)',
      color: colors.primary,
    },
    {
      id: 'investments',
      title: 'Investments',
      icon: TrendingUp,
      route: '/(tabs)/investments',
    },
    {
      id: 'transactions',
      title: 'Transactions',
      icon: CreditCard,
      route: '/(tabs)/transactions',
    },
    {
      id: 'expenses',
      title: 'Expenses',
      icon: PieChart,
      route: '/(tabs)/expenses',
    },
    {
      id: 'goals',
      title: 'Goals',
      icon: Target,
      route: '/(tabs)/goals',
    },
    {
      id: 'ai-chat',
      title: 'AI Finance Tool',
      icon: Bot,
      route: '/(stack)/ai-finance',
      color: colors.accent,
    },
    {
      id: 'currency-converter',
      title: 'Currency Converter',
      icon: ArrowUpDown,
      route: '/(stack)/currency-converter',
    },
    {
      id: 'learning-hub',
      title: 'Learning Hub',
      icon: BookOpen,
      route: '/(stack)/learning-hub',
    },
  ];

  const moreMenuItems = [
    {
      id: 'profile',
      title: 'Profile',
      icon: User,
      route: '/(stack)/profile',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      route: '/(stack)/settings',
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
      route: '/(stack)/learning-hub',
    },
  ];

  const handleNavigation = (route: string) => {
    router.push(route as any);
    if (isSmall) {
      onToggle(); // Close sidebar on mobile after navigation
    }
  };

  const handleMoreMenu = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  const isActiveRoute = (route: string) => {
    return pathname === route || pathname.startsWith(route);
  };

  const sidebarWidth = isSmall ? 280 : isTablet ? 320 : 280;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && isSmall && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={onToggle}
          activeOpacity={1}
        />
      )}

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            backgroundColor: colors.surface,
            borderRightColor: colors.border,
            width: sidebarWidth,
            transform: [{ translateX: isOpen ? 0 : -sidebarWidth }],
          },
        ]}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.logoContainer}>
            <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
              <Text style={styles.logoText}>📊</Text>
            </View>
            <Text style={[styles.logoTitle, { color: colors.text }]}>WealthLens</Text>
          </View>
          <TouchableOpacity onPress={onToggle} style={styles.closeButton}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Navigation Items */}
        <View style={styles.navigation}>
          {navigationItems.map((item) => {
            const isActive = isActiveRoute(item.route);
            const IconComponent = item.icon;
            
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.navItem,
                  isActive && { backgroundColor: colors.primary + '15' },
                ]}
                onPress={() => handleNavigation(item.route)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.navIconContainer,
                  isActive && { backgroundColor: colors.primary + '20' }
                ]}>
                  <IconComponent
                    size={20}
                    color={isActive ? (item.color || colors.primary) : colors.textSecondary}
                  />
                </View>
                <Text
                  style={[
                    styles.navText,
                    {
                      color: isActive ? colors.text : colors.textSecondary,
                      fontWeight: isActive ? '600' : '400',
                    },
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* More Menu */}
        <View style={[styles.moreSection, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.moreButton, showMoreMenu && { backgroundColor: colors.primary + '15' }]}
            onPress={handleMoreMenu}
            activeOpacity={0.7}
          >
            <View style={styles.navIconContainer}>
              <MoreHorizontal size={20} color={colors.textSecondary} />
            </View>
            <Text style={[styles.navText, { color: colors.textSecondary }]}>
              More
            </Text>
          </TouchableOpacity>

          {showMoreMenu && (
            <View style={styles.moreMenu}>
              {moreMenuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = isActiveRoute(item.route);
                
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.moreMenuItem,
                      isActive && { backgroundColor: colors.primary + '15' },
                    ]}
                    onPress={() => handleNavigation(item.route)}
                    activeOpacity={0.7}
                  >
                    <IconComponent
                      size={18}
                      color={isActive ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.moreMenuText,
                        {
                          color: isActive ? colors.text : colors.textSecondary,
                          fontWeight: isActive ? '600' : '400',
                        },
                      ]}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRightWidth: 1,
    zIndex: 1000,
    elevation: 10,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 16,
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  navigation: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  navIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  navText: {
    fontSize: 16,
    flex: 1,
  },
  moreSection: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  moreMenu: {
    marginTop: 8,
    paddingLeft: 16,
  },
  moreMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 2,
  },
  moreMenuText: {
    fontSize: 14,
    marginLeft: 12,
  },
});
