import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive, getResponsivePadding } from '@/hooks/useResponsive';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export function Card({ children, style }: CardProps) {
  const { colors } = useTheme();
  const { isSmall, isMedium, isTablet } = useResponsive();

  const responsivePadding = getResponsivePadding({
    small: isSmall ? 16 : 20,
    medium: isMedium ? 20 : 24,
    large: isTablet ? 24 : 28
  });

  const responsiveRadius = isSmall ? 12 : isTablet ? 16 : 14;
  const responsiveMargin = isSmall ? 12 : 16;

  return (
    <View style={[
      styles.card,
      {
        backgroundColor: colors.surface,
        shadowColor: colors.text,
        padding: responsivePadding,
        borderRadius: responsiveRadius,
        marginBottom: responsiveMargin,
      },
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});