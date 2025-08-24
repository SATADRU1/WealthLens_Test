import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  colors: {
    primary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    error: string;
    warning: string;
  };
}

const lightColors = {
  primary: '#2563EB', // Blue 600
  accent: '#2563EB',
  background: '#F8FAFC', // slate-50
  surface: '#FFFFFF',
  text: '#0F172A', // slate-900
  textSecondary: '#475569', // slate-600
  border: '#E2E8F0', // slate-200
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
};

const darkColors = {
  primary: '#2563EB',
  accent: '#2563EB',
  background: '#0B1220', // deep dark
  surface: '#111827', // gray-900
  text: '#F8FAFC', // slate-50
  textSecondary: '#94A3B8', // slate-400
  border: '#1F2937', // gray-800
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? lightColors : darkColors;
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, colors }}>
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}