import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

interface ScreenData {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

interface ResponsiveBreakpoints {
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
}

export const useResponsive = (): ResponsiveBreakpoints & ScreenData => {
  const [screenData, setScreenData] = useState<ScreenData>(() => {
    const { width, height, scale, fontScale } = Dimensions.get('window');
    return { width, height, scale, fontScale };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData({
        width: window.width,
        height: window.height,
        scale: window.scale,
        fontScale: window.fontScale,
      });
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = screenData;
  const orientation = width > height ? 'landscape' : 'portrait';

  // Breakpoints
  const isSmall = width < 480;
  const isMedium = width >= 480 && width < 768;
  const isLarge = width >= 768 && width < 1024;
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;

  return {
    ...screenData,
    isSmall,
    isMedium,
    isLarge,
    isTablet,
    isDesktop,
    orientation,
  };
};

// Responsive spacing utility
export const getResponsiveSpacing = (base: number, multiplier?: { small?: number; medium?: number; large?: number }) => {
  const { isSmall, isMedium, isLarge } = useResponsive();
  
  if (isSmall && multiplier?.small) return base * multiplier.small;
  if (isMedium && multiplier?.medium) return base * multiplier.medium;
  if (isLarge && multiplier?.large) return base * multiplier.large;
  
  return base;
};

// Responsive font size utility
export const getResponsiveFontSize = (base: number, scale?: { small?: number; medium?: number; large?: number }) => {
  const { isSmall, isMedium, isLarge, fontScale } = useResponsive();
  
  let fontSize = base;
  
  if (isSmall && scale?.small) fontSize = base * scale.small;
  else if (isMedium && scale?.medium) fontSize = base * scale.medium;
  else if (isLarge && scale?.large) fontSize = base * scale.large;
  
  return fontSize * fontScale;
};

// Responsive grid columns
export const getResponsiveColumns = (columns: { small?: number; medium?: number; large?: number }) => {
  const { isSmall, isMedium, isLarge } = useResponsive();
  
  if (isSmall && columns.small) return columns.small;
  if (isMedium && columns.medium) return columns.medium;
  if (isLarge && columns.large) return columns.large;
  
  return 1;
};

// Responsive padding/margin
export const getResponsivePadding = (padding: number | { small?: number; medium?: number; large?: number }) => {
  const { isSmall, isMedium, isLarge } = useResponsive();
  
  if (typeof padding === 'number') return padding;
  
  if (isSmall && padding.small) return padding.small;
  if (isMedium && padding.medium) return padding.medium;
  if (isLarge && padding.large) return padding.large;
  
  return 16; // default
};
