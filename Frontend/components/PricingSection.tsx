import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Check } from 'lucide-react-native';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: 'primary' | 'outline';
  isPopular?: boolean;
  comingSoon?: boolean;
}

export function PricingSection() {
  const { colors } = useTheme();
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/(auth)/signup');
  };

  const pricingTiers: PricingTier[] = [
    {
      name: 'Free',
      price: '₹0',
      period: '/month',
      description: 'Get started with our core features for free.',
      features: [
        'Basic Expense Tracking',
        '1 Linked Bank Account',
        'Investment Portfolio Overview'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'primary'
    },
    {
      name: 'Pro',
      price: '₹499',
      period: '/month',
      description: 'Unlock advanced features and unlimited access.',
      features: [
        'Advanced Analytics',
        'Unlimited Bank Accounts',
        'AI Financial Advisor'
      ],
      buttonText: 'Coming Soon',
      buttonVariant: 'outline',
      isPopular: true,
      comingSoon: true
    }
  ];

  const FeatureItem = ({ feature }: { feature: string }) => (
    <View style={styles.featureItem}>
      <View style={[styles.checkIcon, { backgroundColor: colors.primary + '20' }]}>
        <Check size={16} color={colors.primary} />
      </View>
      <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Simple, Transparent{'\n'}Pricing
      </Text>
      
      <View style={styles.tiersContainer}>
        {pricingTiers.map((tier, index) => (
          <Card
            key={index}
            style={[
              styles.tierCard,
              tier.isPopular ? { borderWidth: 2, borderColor: colors.primary } : {}
            ]}
          >
            {tier.isPopular && (
              <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
            )}
            
            <View style={styles.tierHeader}>
              <Text style={[styles.tierName, { color: colors.text }]}>{tier.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={[styles.price, { color: colors.text }]}>{tier.price}</Text>
                <Text style={[styles.period, { color: colors.textSecondary }]}>{tier.period}</Text>
              </View>
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {tier.description}
              </Text>
            </View>

            <View style={styles.featuresContainer}>
              {tier.features.map((feature, featureIndex) => (
                <FeatureItem key={featureIndex} feature={feature} />
              ))}
            </View>

            <Button
              title={tier.buttonText}
              onPress={tier.comingSoon ? () => {} : handleGetStarted}
              variant={tier.buttonVariant}
              style={[
                styles.tierButton,
                tier.comingSoon ? { opacity: 0.6 } : {}
              ]}
              disabled={tier.comingSoon}
            />
            
            {tier.comingSoon && (
              <Text style={[styles.comingSoonText, { color: colors.textSecondary }]}>
                Coming Soon
              </Text>
            )}
          </Card>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 36,
  },
  tiersContainer: {
    gap: 20,
  },
  tierCard: {
    padding: 24,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  tierHeader: {
    marginBottom: 24,
  },
  tierName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  period: {
    fontSize: 16,
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
  featuresContainer: {
    marginBottom: 24,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 16,
    flex: 1,
  },
  tierButton: {
    width: '100%',
    paddingVertical: 16,
  },
  comingSoonText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
