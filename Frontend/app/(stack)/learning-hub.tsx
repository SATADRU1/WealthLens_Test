import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/Card';
import { mockArticles } from '@/data/mockData';
import { ExternalLink, BookOpen } from 'lucide-react-native';

export default function LearningHubScreen() {
  const { colors } = useTheme();

  const handleReadMore = (articleId: string) => {
    // In a real app, this would navigate to the full article
    console.log('Reading article:', articleId);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <BookOpen size={32} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>Learning Hub</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Expand your financial knowledge with our curated articles
        </Text>
      </View>

      <View style={styles.articlesGrid}>
        {mockArticles.map((article) => (
          <Card key={article.id} style={styles.articleCard}>
            <Image
              source={{ uri: article.imageUrl }}
              style={styles.articleImage}
              resizeMode="cover"
            />
            
            <View style={styles.articleContent}>
              <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.categoryText, { color: colors.primary }]}>
                  {article.category}
                </Text>
              </View>
              
              <Text style={[styles.articleTitle, { color: colors.text }]}>
                {article.title}
              </Text>
              
              <Text style={[styles.articleDescription, { color: colors.textSecondary }]}>
                {article.description}
              </Text>
              
              <TouchableOpacity
                style={[styles.readMoreButton, { backgroundColor: colors.primary }]}
                onPress={() => handleReadMore(article.id)}
              >
                <ExternalLink size={16} color="#FFFFFF" />
                <Text style={styles.readMoreText}>Read More</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </View>

      <Card style={styles.featuredSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Featured Topics
        </Text>
        
        <View style={styles.topicsContainer}>
          {[
            'Personal Finance Basics',
            'Investment Strategies',
            'Retirement Planning',
            'Tax Optimization',
            'Cryptocurrency',
            'Real Estate Investing',
          ].map((topic, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.topicChip, { backgroundColor: colors.accent + '20' }]}
            >
              <Text style={[styles.topicText, { color: colors.accent }]}>
                {topic}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card style={styles.newsletterSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Stay Updated
        </Text>
        <Text style={[styles.newsletterDescription, { color: colors.textSecondary }]}>
          Get the latest financial insights delivered to your inbox weekly.
        </Text>
        <TouchableOpacity
          style={[styles.subscribeButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.subscribeButtonText}>Subscribe to Newsletter</Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  articlesGrid: {
    marginBottom: 16,
  },
  articleCard: {
    padding: 0,
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    height: 180,
  },
  articleContent: {
    padding: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 24,
  },
  articleDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  readMoreText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  featuredSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  topicText: {
    fontSize: 12,
    fontWeight: '500',
  },
  newsletterSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  newsletterDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  subscribeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});