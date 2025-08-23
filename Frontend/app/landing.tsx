import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive, getResponsiveFontSize, getResponsivePadding } from '@/hooks/useResponsive';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PricingSection } from '@/components/PricingSection';
import { TrendingUp, Target, PieChart, BarChart3, Shield, Smartphone } from 'lucide-react-native';

export default function LandingPage() {
  const { colors } = useTheme();
  const { isSmall, isMedium, isTablet, isDesktop } = useResponsive();
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/(auth)/signup');
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const features = [
    {
      icon: TrendingUp,
      title: 'Investment Tracking',
      description: 'Monitor your stocks, crypto, and other investments in real-time. Understand your portfolio\'s performance at a glance.'
    },
    {
      icon: Target,
      title: 'Goal Setting',
      description: 'Set and track your financial goals. Whether it\'s saving for a house or retirement, we help you stay on track.'
    },
    {
      icon: PieChart,
      title: 'Expense Management',
      description: 'Track your daily expenses and understand where your money goes. Make informed financial decisions.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Get detailed insights into your financial patterns with comprehensive charts and reports.'
    }
  ];

  // Dynamic styles based on responsive values
  const dynamicStyles = {
    header: {
      ...styles.header,
      paddingHorizontal: getResponsivePadding({ small: 16, medium: 24, large: 32 }),
      paddingTop: getResponsivePadding({ small: 50, medium: 60, large: 70 }),
      paddingBottom: getResponsivePadding({ small: 16, medium: 20, large: 24 }),
    },
    hero: {
      ...styles.hero,
      paddingHorizontal: getResponsivePadding({ small: 16, medium: 24, large: 32 }),
      paddingVertical: getResponsivePadding({ small: 32, medium: 40, large: 48 }),
    },
    featuresSection: {
      ...styles.featuresSection,
      paddingHorizontal: getResponsivePadding({ small: 16, medium: 24, large: 32 }),
      paddingBottom: getResponsivePadding({ small: 32, medium: 40, large: 48 }),
    },
    featuresGrid: {
      ...styles.featuresGrid,
      gap: getResponsivePadding({ small: 16, medium: 24, large: 32 }),
      flexDirection: (isTablet ? 'row' : 'column') as 'row' | 'column',
      flexWrap: 'wrap' as 'wrap',
    },
    featureCard: {
      ...styles.featureCard,
      flex: isTablet ? 1 : undefined,
      minWidth: isTablet ? 280 : undefined,
      maxWidth: isTablet ? 350 : undefined,
    },
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[dynamicStyles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <View style={styles.logo}>
            <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
              <Text style={styles.logoText}>📊</Text>
            </View>
            <Text style={[styles.logoTitle, { color: colors.text }]}>WealthLens</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={[styles.loginText, { color: colors.text }]}>Login</Text>
            </TouchableOpacity>
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              size="small"
              style={styles.getStartedButton}
            />
          </View>
        </View>
      </View>

      {/* Hero Section */}
      <View style={dynamicStyles.hero}>
        <Text style={[styles.heroTitle, {
          color: colors.text,
          fontSize: getResponsiveFontSize(32, { small: 0.8, medium: 1, large: 1.2 }),
          lineHeight: getResponsiveFontSize(40, { small: 0.8, medium: 1, large: 1.2 }),
          marginBottom: getResponsivePadding({ small: 12, medium: 16, large: 20 }),
        }]}>
          Gain Clarity on Your{'\n'}Finances.
        </Text>
        <Text style={[styles.heroSubtitle, {
          color: colors.textSecondary,
          fontSize: getResponsiveFontSize(16, { small: 0.9, medium: 1, large: 1.1 }),
          lineHeight: getResponsiveFontSize(24, { small: 0.9, medium: 1, large: 1.1 }),
          marginBottom: getResponsivePadding({ small: 24, medium: 32, large: 40 }),
        }]}>
          WealthLens provides you with the tools to track, manage, and grow your wealth. From investments to daily expenses, see the full picture.
        </Text>
        <Button
          title="Sign Up for Free"
          onPress={handleGetStarted}
          style={styles.heroButton}
        />
      </View>

      {/* Features Section */}
      <View style={dynamicStyles.featuresSection}>
        <Text style={[styles.sectionTitle, {
          color: colors.text,
          fontSize: getResponsiveFontSize(28, { small: 0.8, medium: 1, large: 1.2 }),
          marginBottom: getResponsivePadding({ small: 32, medium: 40, large: 48 }),
        }]}>
          All-in-One Financial{'\n'}Toolkit
        </Text>

        <View style={dynamicStyles.featuresGrid}>
          {features.map((feature, index) => (
            <Card key={index} style={dynamicStyles.featureCard}>
              <View style={[styles.featureIcon, {
                backgroundColor: colors.primary + '20',
                width: getResponsivePadding({ small: 40, medium: 48, large: 56 }),
                height: getResponsivePadding({ small: 40, medium: 48, large: 56 }),
              }]}>
                <feature.icon size={isSmall ? 20 : isTablet ? 28 : 24} color={colors.primary} />
              </View>
              <Text style={[styles.featureTitle, {
                color: colors.text,
                fontSize: getResponsiveFontSize(20, { small: 0.9, medium: 1, large: 1.1 }),
              }]}>
                {feature.title}
              </Text>
              <Text style={[styles.featureDescription, {
                color: colors.textSecondary,
                fontSize: getResponsiveFontSize(16, { small: 0.9, medium: 1, large: 1.05 }),
              }]}>
                {feature.description}
              </Text>
            </Card>
          ))}
        </View>
      </View>

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA Section */}
      <View style={[styles.ctaSection, { backgroundColor: colors.surface }]}>
        <Text style={[styles.ctaTitle, { color: colors.text }]}>
          Ready to take control of your finances?
        </Text>
        <Text style={[styles.ctaSubtitle, { color: colors.textSecondary }]}>
          Join thousands of users who trust WealthLens with their financial journey.
        </Text>
        <Button
          title="Get Started Today"
          onPress={handleGetStarted}
          style={styles.ctaButton}
        />
      </View>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          © 2025 WealthLens. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoText: {
    fontSize: 16,
  },
  logoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  loginText: {
    fontSize: 16,
    fontWeight: '500',
  },
  getStartedButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  hero: {
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 44,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    maxWidth: 400,
  },
  heroButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 40,
  },
  featuresGrid: {
    gap: 20,
  },
  featureCard: {
    padding: 24,
    alignItems: 'center',
    textAlign: 'center',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    alignItems: 'center',
    marginTop: 40,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 400,
  },
  ctaButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
