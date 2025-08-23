import React from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive, getResponsiveFontSize, getResponsivePadding } from '@/hooks/useResponsive';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const { colors } = useTheme();
  const { isSmall, isMedium, isTablet } = useResponsive();

  const responsiveFontSize = getResponsiveFontSize(16, {
    small: 0.9,
    medium: 1,
    large: 1.1
  });

  const responsivePadding = getResponsivePadding({
    small: isSmall ? 12 : 16,
    medium: isMedium ? 16 : 18,
    large: isTablet ? 18 : 20
  });

  const responsiveRadius = isSmall ? 8 : isTablet ? 12 : 10;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[
          styles.label,
          {
            color: colors.text,
            fontSize: responsiveFontSize * 0.9,
            marginBottom: isSmall ? 6 : 8,
          }
        ]}>{label}</Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
            color: colors.text,
            fontSize: responsiveFontSize,
            paddingHorizontal: responsivePadding,
            paddingVertical: responsivePadding * 0.75,
            borderRadius: responsiveRadius,
            minHeight: isSmall ? 44 : 48, // Better touch targets
          },
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});