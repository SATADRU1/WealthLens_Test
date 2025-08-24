import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle | ViewStyle[];
}

// Lightweight pulsing skeleton block
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}) => {
  const { colors, isDark } = useTheme();
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.6, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  // Subtle theme-aware background
  const baseBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)';

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseBg,
        },
        style as any,
        { opacity },
      ]}
    />
  );
};