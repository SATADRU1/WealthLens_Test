import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Card } from '@/components/Card';
import {
  BookOpen,
  Play,
  Clock,
  Star,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  PieChart,
  Target,
  Shield,
  Briefcase
} from 'lucide-react-native';
import { learningContentService, Article, Category } from '@/services/learningContentService';

const CATEGORY_ICONS = {
  'investing': TrendingUp,
  'budgeting': DollarSign,
  'retirement': Target,
  'insurance': Shield,
  'business': Briefcase,
  'analysis': PieChart,
};

export default function LearningHubScreen() {
  const { colors } = useTheme();
  const { isSmall, isTablet } = useResponsive();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Load initial data
    setArticles(learningContentService.getAllArticles());
    setCategories(learningContentService.getCategories());
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || article.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return colors.success;
      case 'Intermediate': return colors.accent;
      case 'Advanced': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const ArticleCard = ({ article }: { article: Article }) => (
    <Card style={[styles.articleCard, isTablet ? styles.articleCardTablet : {}]}>
      <View style={styles.articleImage}>
        <View style={[styles.placeholderImage, { backgroundColor: colors.border }]}>
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            600 × 400
          </Text>
        </View>
        {article.isVideo && (
          <View style={[styles.videoOverlay, { backgroundColor: colors.primary }]}>
            <Play size={24} color="#FFFFFF" />
          </View>
        )}
      </View>
      
      <View style={styles.articleContent}>
        <View style={styles.articleHeader}>
          <View style={[
            styles.categoryBadge, 
            { backgroundColor: colors.primary + '20' }
          ]}>
            <Text style={[styles.categoryText, { color: colors.primary }]}>
              {article.category}
            </Text>
          </View>
          <View style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(article.difficulty) + '20' }
          ]}>
            <Text style={[
              styles.difficultyText,
              { color: getDifficultyColor(article.difficulty) }
            ]}>
              {article.difficulty}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.articleTitle, { color: colors.text }]}>
          {article.title}
        </Text>
        
        <Text style={[styles.articleDescription, { color: colors.textSecondary }]}>
          {article.description}
        </Text>
        
        <View style={styles.articleFooter}>
          <View style={styles.articleMeta}>
            <View style={styles.metaItem}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {article.readTime} min read
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Star size={14} color={colors.accent} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {article.rating}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={[styles.readButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.readButtonText}>
              {article.isVideo ? 'Watch' : 'Read More'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Financial Learning Hub
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Expand your financial knowledge with our articles and courses.
          </Text>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search articles and courses..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Categories
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {categories.map((category) => {
              const IconComponent = CATEGORY_ICONS[category.id as keyof typeof CATEGORY_ICONS] || BookOpen;
              const isSelected = selectedCategory === category.name;

              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    {
                      backgroundColor: isSelected ? category.color + '20' : colors.surface,
                      borderColor: isSelected ? category.color : colors.border,
                    }
                  ]}
                  onPress={() => setSelectedCategory(isSelected ? null : category.name)}
                >
                  <View style={[
                    styles.categoryIcon,
                    { backgroundColor: category.color + '20' }
                  ]}>
                    <IconComponent size={24} color={category.color} />
                  </View>
                  <Text style={[
                    styles.categoryName,
                    { color: isSelected ? category.color : colors.text }
                  ]}>
                    {category.name}
                  </Text>
                  <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>
                    {category.articleCount} articles
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Difficulty Filter */}
        <View style={styles.difficultySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Difficulty Level
          </Text>
          <View style={styles.difficultyButtons}>
            {['Beginner', 'Intermediate', 'Advanced'].map((level) => {
              const isSelected = selectedDifficulty === level;
              return (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.difficultyButton,
                    {
                      backgroundColor: isSelected ? getDifficultyColor(level) + '20' : colors.surface,
                      borderColor: isSelected ? getDifficultyColor(level) : colors.border,
                    }
                  ]}
                  onPress={() => setSelectedDifficulty(isSelected ? null : level)}
                >
                  <Text style={[
                    styles.difficultyButtonText,
                    { color: isSelected ? getDifficultyColor(level) : colors.text }
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Articles Grid */}
        <View style={styles.articlesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Featured Articles & Courses
          </Text>
          <View style={[
            styles.articlesGrid,
            isTablet && styles.articlesGridTablet
          ]}>
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterButton: {
    padding: 4,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoriesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoryCard: {
    width: 140,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    textAlign: 'center',
  },
  difficultySection: {
    marginBottom: 24,
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  difficultyButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  articlesSection: {
    marginBottom: 24,
  },
  articlesGrid: {
    gap: 16,
  },
  articlesGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  articleCard: {
    overflow: 'hidden',
  },
  articleCardTablet: {
    width: '48%',
  },
  articleImage: {
    position: 'relative',
    marginBottom: 16,
  },
  placeholderImage: {
    height: 200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  videoOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleContent: {
    flex: 1,
  },
  articleHeader: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  articleDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  readButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  readButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
