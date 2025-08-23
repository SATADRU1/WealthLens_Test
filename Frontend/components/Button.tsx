import React, { ReactNode } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive, getResponsiveFontSize, getResponsivePadding } from '@/hooks/useResponsive';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  disabled?: boolean;
  children?: ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  disabled = false,
  children
}: ButtonProps) {
  const { colors } = useTheme();
  const { isSmall, isMedium, isTablet } = useResponsive();

  const getButtonStyle = () => {
    const responsivePadding = getResponsivePadding({
      small: isSmall ? 12 : 16,
      medium: isMedium ? 16 : 20,
      large: isTablet ? 20 : 24
    });

    const baseStyle = [
      styles.button,
      styles[size],
      {
        paddingHorizontal: responsivePadding,
        paddingVertical: isSmall ? 12 : 16,
        minHeight: isSmall ? 44 : 48, // Better touch targets
      }
    ];

    switch (variant) {
      case 'primary':
        return [...baseStyle, { backgroundColor: colors.primary }];
      case 'secondary':
        return [...baseStyle, { backgroundColor: colors.accent }];
      case 'outline':
        return [...baseStyle, { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary }];
      default:
        return [...baseStyle, { backgroundColor: colors.primary }];
    }
  };

  const getTextStyle = () => {
    const responsiveFontSize = getResponsiveFontSize(16, {
      small: 0.9,
      medium: 1,
      large: 1.1
    });

    const baseStyle = [
      styles.text,
      {
        fontSize: responsiveFontSize,
        lineHeight: responsiveFontSize * 1.2,
      }
    ];

    switch (variant) {
      case 'outline':
        return [...baseStyle, { color: colors.primary }];
      default:
        return [...baseStyle, { color: '#FFFFFF' }];
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style, disabled && { opacity: 0.6 }]}
      onPress={onPress}
      disabled={disabled}
    >
      {children ? children : <Text style={[getTextStyle(), textStyle]}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  text: {
    fontWeight: '600',
    fontSize: 16,
  },
});