import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/Card';
import { BookOpen, Target, Bot, TrendingUp, CreditCard, ChartPie, ShieldCheck, Rocket } from 'lucide-react-native';

export default function AboutScreen() {
  const { colors } = useTheme();

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </Card>
  );

  const Bullet = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.bulletRow}>
      <View style={[styles.bulletDot, { backgroundColor: colors.primary }]} />
      <Text style={[styles.bulletText, { color: colors.textSecondary }]}>{children}</Text>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}
                contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <BookOpen size={32} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>About WealthLens</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          A smart, end-to-end personal finance platform to plan, track, and grow your wealth.
        </Text>
      </View>

      {/* What is WealthLens */}
      <Section title="What is WealthLens?">
        <Bullet>Unified dashboard for your finances—overview, cashflow, and goals at a glance.</Bullet>
        <Bullet>Actionable insights powered by AI to help you make smarter decisions.</Bullet>
        <Bullet>Modern, mobile-first experience built with performance and accessibility in mind.</Bullet>
      </Section>

      {/* Core Features */}
      <Section title="Core Features of Wealthlens">
        <View style={styles.featureRow}>
          <TrendingUp size={18} color={colors.accent} />
          <Text style={[styles.featureTitle, { color: colors.text }]}>Investments</Text>
        </View>
        <Bullet>Portfolio snapshot with trends and performance highlights.</Bullet>
        <Bullet>Market data and contextual tips for long-term strategies.</Bullet>

        <View style={styles.featureRow}>
          <CreditCard size={18} color={colors.accent} />
          <Text style={[styles.featureTitle, { color: colors.text }]}>Transactions</Text>
        </View>
        <Bullet>Clean history view with categories and quick filters.</Bullet>
        <Bullet>Identify recurring payments and unusual activity faster.</Bullet>

        <View style={styles.featureRow}>
          <ChartPie size={18} color={colors.accent} />
          <Text style={[styles.featureTitle, { color: colors.text }]}>Expenses</Text>
        </View>
        <Bullet>Visual breakdown of spending by category and time.</Bullet>
        <Bullet>Monthly budgets with gentle nudges and insights.</Bullet>

        <View style={styles.featureRow}>
          <Target size={18} color={colors.accent} />
          <Text style={[styles.featureTitle, { color: colors.text }]}>Goals</Text>
        </View>
        <Bullet>Create savings or investment goals with dynamic progress tracking.</Bullet>
        <Bullet>AI suggestions to fine-tune timelines and contributions.</Bullet>

        <View style={styles.featureRow}>
          <Bot size={18} color={colors.accent} />
          <Text style={[styles.featureTitle, { color: colors.text }]}>AI Finance Tool</Text>
        </View>
        <Bullet>Ask finance questions in natural language—get concise, personalized guidance.</Bullet>
        <Bullet>Research assistant for market context, definitions, and best practices.</Bullet>

        <View style={styles.featureRow}>
          <TrendingUp size={18} color={colors.accent} />
          <Text style={[styles.featureTitle, { color: colors.text }]}>Currency Converter & Learning Hub</Text>
        </View>
        <Bullet>Fast FX conversions with up-to-date rates.</Bullet>
        <Bullet>Curated learning content to build financial confidence.</Bullet>
      </Section>

      {/* How It Works */}
      <Section title="How It Works">
        <Bullet>Connect data sources or use manual inputs to start.</Bullet>
        <Bullet>We analyze patterns to surface insights and recommendations.</Bullet>
        <Bullet>Track, adjust, and grow—your plan evolves with you.</Bullet>
      </Section>

      {/* Technology & Security */}
      <Section title="Technology & Security">
        <Bullet>Frontend: React Native with Expo for a smooth mobile & web experience.</Bullet>
        <Bullet>Backend: FastAPI with modular tools for data, research, and AI.</Bullet>
        <Bullet>Data: Structured storage with room for vector search where it matters.</Bullet>
        <View style={styles.featureRow}>
          <ShieldCheck size={18} color={colors.accent} />
          <Text style={[styles.featureTitle, { color: colors.text }]}>Security-first design</Text>
        </View>
        <Bullet>Environment-based configuration and careful handling of sensitive keys.</Bullet>
      </Section>

      {/* Roadmap Snapshot */}
      <Section title="Roadmap Snapshot">
        <View style={styles.featureRow}>
          <Rocket size={18} color={colors.accent} />
          <Text style={[styles.featureTitle, { color: colors.text }]}>Upcoming</Text>
        </View>
        <Bullet>Deeper budgeting automations and anomaly alerts.</Bullet>
        <Bullet>Richer goal simulations and multi-currency portfolios.</Bullet>
        <Bullet>More personalized learning paths and checklists.</Bullet>
      </Section>

      {/* Team */}
      <Section title="The Team">
        <Text style={[styles.teamText, { color: colors.text }]}>
          We’re a small, determined team that cares about clarity, reliability, and delightful details.
        </Text>
        <View style={styles.teamBlock}>
          <Text style={[styles.memberName, { color: colors.text }]}>Satadru Mondal</Text>
          <Text style={[styles.memberRole, { color: colors.textSecondary }]}>Whole codebase developer & bug finder</Text>
          <Text style={[styles.memberDesc, { color: colors.textSecondary }]}>
            Leads the end-to-end implementation across the stack, shaping architecture, writing robust features,
            and hunting down edge-case bugs to keep the experience smooth and dependable.
          </Text>
        </View>
        <View style={styles.teamBlock}>
          <Text style={[styles.memberName, { color: colors.text }]}>Soumajit Dutta</Text>
          <Text style={[styles.memberRole, { color: colors.textSecondary }]}>Documentation & frontend developer, debug fixer</Text>
          <Text style={[styles.memberDesc, { color: colors.textSecondary }]}>
            Crafts a clean, user-friendly interface and clear documentation. Bridges design and development while
            quickly diagnosing and resolving UI/UX issues.
          </Text>
        </View>
        <View style={styles.teamBlock}>
          <Text style={[styles.memberName, { color: colors.text }]}>Sangbed Pati</Text>
          <Text style={[styles.memberRole, { color: colors.textSecondary }]}>Backend developer & code fixer</Text>
          <Text style={[styles.memberDesc, { color: colors.textSecondary }]}>
            Builds reliable APIs and data flows, optimizes performance, and keeps the system stable with thoughtful
            refactors and pragmatic fixes.
          </Text>
        </View>
        <Text style={[styles.closingNote, { color: colors.textSecondary }]}>
          Together, we’re building WealthLens with care—balancing smart automation with human-friendly design.
        </Text>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 32 },
  header: { alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 8 },
  subtitle: { fontSize: 16, textAlign: 'center', marginTop: 4, paddingHorizontal: 20 },

  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  sectionBody: { gap: 8 },

  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 8 },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 20 },

  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  featureTitle: { fontSize: 16, fontWeight: '600' },

  teamText: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  teamBlock: { marginTop: 8 },
  memberName: { fontSize: 16, fontWeight: '700' },
  memberRole: { fontSize: 13, marginTop: 2 },
  memberDesc: { fontSize: 13, lineHeight: 20, marginTop: 4 },
  closingNote: { fontSize: 13, lineHeight: 20, marginTop: 12 },
});