import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive, getResponsiveFontSize, getResponsivePadding } from '@/hooks/useResponsive';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { TrendingUp, Target, Brain, CheckCircle } from 'lucide-react-native';

export default function HomePage() {
  const { colors } = useTheme();
  const { isSmall, isMedium, isTablet, isDesktop, width } = useResponsive();

  const handleGetStarted = () => {
    // Navigate to signup
  };

  // Dynamic styles based on responsive values
  const dynamicStyles = {
    header: {
      ...styles.header,
      paddingHorizontal: getResponsivePadding({ small: 16, medium: 24, large: 32 }),
      paddingTop: getResponsivePadding({ small: 50, medium: 60, large: 70 }),
      paddingBottom: getResponsivePadding({ small: 16, medium: 20, large: 24 }),
    },
    heroSection: {
      ...styles.heroSection,
      paddingHorizontal: getResponsivePadding({ small: 16, medium: 24, large: 32 }),
      paddingVertical: getResponsivePadding({ small: 32, medium: 40, large: 48 }),
    },
    featuresSection: {
      ...styles.featuresSection,
      paddingHorizontal: getResponsivePadding({ small: 16, medium: 24, large: 32 }),
      paddingBottom: getResponsivePadding({ small: 32, medium: 40, large: 48 }),
    },
    featureCards: {
      ...styles.featureCards,
      gap: getResponsivePadding({ small: 16, medium: 24, large: 32 }),
      flexDirection: (isTablet ? 'row' : 'column') as 'row' | 'column',
      flexWrap: 'wrap' as 'wrap',
      justifyContent: 'center' as 'center',
    },
    featureCard: {
      ...styles.featureCard,
      flex: isTablet ? 1 : undefined,
      minWidth: isTablet ? 300 : undefined,
      maxWidth: isTablet ? 400 : undefined,
      width: (isTablet ? undefined : '100%') as '100%' | undefined,
    },
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <View style={styles.logoContainer}>
          <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoText}>📊</Text>
          </View>
          <Text style={[styles.logoTitle, { color: colors.text }]}>WealthLens</Text>
        </View>
        <View style={styles.headerButtons}>
          <Link href="/(auth)/login" asChild>
            <Button title="Login" variant="outline" style={styles.loginButton} onPress={() => {}} />
          </Link>
          <Link href="/(auth)/signup" asChild>
            <Button title="Get Started" style={styles.getStartedButton} onPress={() => {}} />
          </Link>
        </View>
      </View>

      {/* Hero Section */}
      <View style={dynamicStyles.heroSection}>
        <Text style={[styles.heroTitle, {
          color: colors.text,
          fontSize: getResponsiveFontSize(32, { small: 0.8, medium: 1, large: 1.2 }),
          lineHeight: getResponsiveFontSize(40, { small: 0.8, medium: 1, large: 1.2 }),
          marginBottom: getResponsivePadding({ small: 12, medium: 16, large: 20 }),
        }]}>
          Gain Clarity on Your Finances.
        </Text>
        <Text style={[styles.heroSubtitle, {
          color: colors.textSecondary,
          fontSize: getResponsiveFontSize(16, { small: 0.9, medium: 1, large: 1.1 }),
          lineHeight: getResponsiveFontSize(24, { small: 0.9, medium: 1, large: 1.1 }),
          marginBottom: getResponsivePadding({ small: 24, medium: 32, large: 40 }),
          maxWidth: getResponsivePadding({ small: 300, medium: 500, large: 600 }),
        }]}>
          WealthLens provides you with the tools to track, manage, and grow your wealth. From investments to daily expenses, see the full picture.
        </Text>
        <Link href="/(auth)/signup" asChild>
          <Button title="Sign Up for Free" style={styles.heroButton} onPress={() => {}} />
        </Link>
      </View>

      {/* Features Section */}
      <View style={dynamicStyles.featuresSection}>
        <Text style={[styles.featuresTitle, {
          color: colors.text,
          fontSize: getResponsiveFontSize(28, { small: 0.8, medium: 1, large: 1.2 }),
          marginBottom: getResponsivePadding({ small: 32, medium: 40, large: 48 }),
        }]}>
          All-in-One Financial Toolkit
        </Text>

        <View style={dynamicStyles.featureCards}>
          <Card style={dynamicStyles.featureCard}>
            <View style={[styles.featureIcon, {
              backgroundColor: colors.primary + '20',
              width: getResponsivePadding({ small: 40, medium: 48, large: 56 }),
              height: getResponsivePadding({ small: 40, medium: 48, large: 56 }),
            }]}>
              <TrendingUp size={isSmall ? 20 : isTablet ? 28 : 24} color={colors.primary} />
            </View>
            <Text style={[styles.featureCardTitle, {
              color: colors.text,
              fontSize: getResponsiveFontSize(20, { small: 0.9, medium: 1, large: 1.1 }),
            }]}>Investment Tracking</Text>
            <Text style={[styles.featureCardDescription, {
              color: colors.textSecondary,
              fontSize: getResponsiveFontSize(16, { small: 0.9, medium: 1, large: 1.05 }),
            }]}>
              Monitor your stocks, crypto, and other investments in real-time. Understand your portfolio's performance at a glance.
            </Text>
          </Card>

          <Card style={dynamicStyles.featureCard}>
            <View style={[styles.featureIcon, {
              backgroundColor: colors.primary + '20',
              width: getResponsivePadding({ small: 40, medium: 48, large: 56 }),
              height: getResponsivePadding({ small: 40, medium: 48, large: 56 }),
            }]}>
              <Target size={isSmall ? 20 : isTablet ? 28 : 24} color={colors.primary} />
            </View>
            <Text style={[styles.featureCardTitle, {
              color: colors.text,
              fontSize: getResponsiveFontSize(20, { small: 0.9, medium: 1, large: 1.1 }),
            }]}>Goal Setting</Text>
            <Text style={[styles.featureCardDescription, {
              color: colors.textSecondary,
              fontSize: getResponsiveFontSize(16, { small: 0.9, medium: 1, large: 1.05 }),
            }]}>
              Set financial goals and track your progress. Whether it's a new car or a house deposit, we'll help you get there.
            </Text>
          </Card>

          <Card style={dynamicStyles.featureCard}>
            <View style={[styles.featureIcon, {
              backgroundColor: colors.primary + '20',
              width: getResponsivePadding({ small: 40, medium: 48, large: 56 }),
              height: getResponsivePadding({ small: 40, medium: 48, large: 56 }),
            }]}>
              <Brain size={isSmall ? 20 : isTablet ? 28 : 24} color={colors.primary} />
            </View>
            <Text style={[styles.featureCardTitle, {
              color: colors.text,
              fontSize: getResponsiveFontSize(20, { small: 0.9, medium: 1, large: 1.1 }),
            }]}>AI-Powered Insights</Text>
            <Text style={[styles.featureCardDescription, {
              color: colors.textSecondary,
              fontSize: getResponsiveFontSize(16, { small: 0.9, medium: 1, large: 1.05 }),
            }]}>
              Our AI finance tool answers your toughest questions and helps you make smarter financial decisions.
            </Text>
          </Card>
        </View>
      </View>

      {/* Pricing Section */}
      <View style={styles.pricingSection}>
        <Text style={[styles.pricingTitle, { color: colors.text }]}>
          Simple, Transparent Pricing
        </Text>

        {/* Free Tier */}
        <Card style={styles.pricingCard}>
          <Text style={[styles.tierName, { color: colors.text }]}>Free</Text>
          <View style={styles.priceContainer}>
            <Text style={[styles.currency, { color: colors.text }]}>₹</Text>
            <Text style={[styles.price, { color: colors.text }]}>0</Text>
            <Text style={[styles.period, { color: colors.textSecondary }]}>/month</Text>
          </View>
          <Text style={[styles.tierDescription, { color: colors.textSecondary }]}>
            Get started with our core features for free.
          </Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={[styles.featureText, { color: colors.text }]}>Basic Expense Tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={[styles.featureText, { color: colors.text }]}>1 Linked Bank Account</Text>
            </View>
            <View style={styles.featureItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={[styles.featureText, { color: colors.text }]}>Investment Portfolio Overview</Text>
            </View>
          </View>

          <Link href="/(auth)/signup" asChild>
            <Button title="Get Started" style={styles.tierButton} onPress={() => {}} />
          </Link>
        </Card>

        {/* Pro Tier */}
        <Card style={[styles.pricingCard, styles.proCard, { borderColor: colors.primary }]}>
          <Text style={[styles.tierName, { color: colors.text }]}>Pro</Text>
          <View style={styles.priceContainer}>
            <Text style={[styles.currency, { color: colors.text }]}>₹</Text>
            <Text style={[styles.price, { color: colors.text }]}>499</Text>
            <Text style={[styles.period, { color: colors.textSecondary }]}>/month</Text>
          </View>
          <Text style={[styles.tierDescription, { color: colors.textSecondary }]}>
            Unlock advanced features and unlimited access.
          </Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={[styles.featureText, { color: colors.text }]}>Advanced Analytics</Text>
            </View>
            <View style={styles.featureItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={[styles.featureText, { color: colors.text }]}>Unlimited Bank Accounts</Text>
            </View>
            <View style={styles.featureItem}>
              <CheckCircle size={16} color={colors.success} />
              <Text style={[styles.featureText, { color: colors.text }]}>AI Financial Advisor</Text>
            </View>
          </View>

          <View style={styles.comingSoonContainer}>
            <View style={[styles.comingSoonBadge, { backgroundColor: colors.textSecondary }]}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
            </View>
          </View>
        </Card>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 120,
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
    gap: 12,
    flexShrink: 0,
  },
  loginButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  getStartedButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  heroSection: {
    alignItems: 'center',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  heroTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heroSubtitle: {
    textAlign: 'center',
  },
  heroButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  pricingSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  pricingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  pricingCard: {
    padding: 32,
    marginBottom: 24,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  proCard: {
    borderWidth: 2,
  },
  tierName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  currency: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  period: {
    fontSize: 16,
    marginLeft: 4,
  },
  tierDescription: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  featuresList: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 12,
  },
  tierButton: {
    width: '100%',
  },
  comingSoonContainer: {
    alignItems: 'center',
  },
  comingSoonBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  comingSoonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  featuresSection: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  featuresTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  featureCards: {
    justifyContent: 'center',
  },
  featureCard: {
    alignSelf: 'center',
    width: '100%',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  featureCardDescription: {
    fontSize: 16,
    lineHeight: 24,
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
