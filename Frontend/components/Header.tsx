import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  StatusBar,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import {
  MoreVertical,
  User,
  Settings,
  Moon,
  Sun,
  LogOut,
  Bell,
  HelpCircle,
  DollarSign
} from 'lucide-react-native';

interface HeaderProps {
  title: string;
  showProfile?: boolean;
}

export function Header({ title, showProfile = true }: HeaderProps) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { isTablet, isDesktop } = useResponsive();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            setShowProfileMenu(false);
            logout();
          }
        }
      ]
    );
  };

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      onPress: () => {
        setShowProfileMenu(false);
        router.push('/(stack)/profile');
      }
    },
    {
      icon: Settings,
      label: 'Settings',
      onPress: () => {
        setShowProfileMenu(false);
        router.push('/(stack)/settings');
      }
    },
    {
      icon: DollarSign,
      label: 'Currency Converter',
      onPress: () => {
        setShowProfileMenu(false);
        router.push('/(stack)/currency-converter');
      }
    },
    {
      icon: isDark ? Sun : Moon,
      label: isDark ? 'Light Mode' : 'Dark Mode',
      onPress: () => {
        toggleTheme();
        setShowProfileMenu(false);
      }
    },
    {
      icon: Bell,
      label: 'Notifications',
      onPress: () => {
        setShowProfileMenu(false);
        Alert.alert('Notifications', 'Notification settings will be available in the Settings screen.');
      }
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      onPress: () => {
        setShowProfileMenu(false);
        Alert.alert(
          'Help & Support',
          'Need help? Contact us:\n\n📧 Email: support@wealthlens.com\n📞 Phone: +1 (555) 123-WEALTH\n\nOr visit the Settings screen for more support options.',
          [
            { text: 'Go to Settings', onPress: () => router.push('/(stack)/settings') },
            { text: 'Close', style: 'cancel' }
          ]
        );
      }
    },
    {
      icon: LogOut,
      label: 'Logout',
      onPress: handleLogout,
      isDestructive: true
    }
  ];

  const styles = createStyles(colors, isTablet, isDesktop);

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.surface}
        translucent={false}
      />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {user?.fullName && (
              <Text style={styles.subtitle}>
                Welcome back, {user.fullName}
              </Text>
            )}
          </View>
          
          {showProfile && (
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => setShowProfileMenu(true)}
              activeOpacity={0.7}
            >
              <MoreVertical size={24} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Profile Menu Modal */}
      <Modal
        visible={showProfileMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProfileMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowProfileMenu(false)}
        >
          <View style={styles.menuContainer}>
            {user?.fullName && (
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userInitial}>
                    {user.fullName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user.fullName}</Text>
                  <Text style={styles.userEmail}>{user.email || 'No email'}</Text>
                </View>
              </View>
            )}
            
            <View style={styles.menuDivider} />
            
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <item.icon 
                  size={20} 
                  color={item.isDestructive ? colors.error : colors.text} 
                />
                <Text style={[
                  styles.menuItemText,
                  item.isDestructive && { color: colors.error }
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const createStyles = (colors: any, isTablet: boolean, isDesktop: boolean) => StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
    elevation: 2,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isTablet ? 24 : 16,
    paddingVertical: isTablet ? 20 : 16,
    minHeight: isTablet ? 80 : 60,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: isTablet ? 16 : 14,
    color: colors.textSecondary,
  },
  profileButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingRight: 16,
  },
  menuContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    minWidth: 250,
    maxWidth: 300,
    elevation: 8,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInitial: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
});
