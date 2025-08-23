import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive, getResponsiveFontSize, getResponsivePadding } from '@/hooks/useResponsive';
import { User, LogOut, Settings, Sun, Moon, MoreHorizontal } from 'lucide-react-native';

interface ProfileDropdownProps {
  style?: any;
}

export function ProfileDropdown({ style }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { colors, theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const { isSmall, isTablet } = useResponsive();

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  const handleSettings = () => {
    setIsOpen(false);
    router.push('/settings' as any);
  };

  const handleProfile = () => {
    setIsOpen(false);
    router.push('/profile' as any);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const dropdownItems = [
    {
      icon: User,
      label: 'Profile',
      onPress: handleProfile,
    },
    {
      icon: Settings,
      label: 'Settings',
      onPress: handleSettings,
    },
    {
      icon: theme === 'light' ? Moon : Sun,
      label: theme === 'light' ? 'Dark Mode' : 'Light Mode',
      onPress: handleThemeToggle,
    },
    {
      icon: LogOut,
      label: 'Logout',
      onPress: handleLogout,
      isDestructive: true,
    },
  ];

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.profileButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <MoreHorizontal
          size={isSmall ? 20 : 24}
          color={colors.text}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable 
          style={styles.overlay} 
          onPress={() => setIsOpen(false)}
        >
          <View style={[
            styles.dropdown, 
            { 
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: colors.text,
            }
          ]}>
            {dropdownItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dropdownItem,
                  index < dropdownItems.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <item.icon 
                  size={isSmall ? 18 : 20} 
                  color={item.isDestructive ? colors.error : colors.text} 
                />
                <Text style={[
                  styles.dropdownItemText, 
                  { 
                    color: item.isDestructive ? colors.error : colors.text,
                    fontSize: getResponsiveFontSize(16, { small: 0.9, medium: 1, large: 1.1 }),
                  }
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  profileButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    width: 44,
    height: 44,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 80,
    paddingRight: 20,
  },
  dropdown: {
    borderRadius: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 200,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  dropdownItemText: {
    fontWeight: '500',
  },
});
