import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Header } from '@/components/Header';
import { Target, Plus, Calendar, DollarSign, TrendingUp } from 'lucide-react-native';

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

export default function GoalsScreen() {
  const { colors } = useTheme();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Emergency Fund',
      targetAmount: 500000,
      currentAmount: 340000,
      deadline: '2024-12-31',
      category: 'Emergency',
    },
    {
      id: '2',
      title: 'New Car',
      targetAmount: 800000,
      currentAmount: 250000,
      deadline: '2025-06-30',
      category: 'Purchase',
    },
    {
      id: '3',
      title: 'Vacation to Europe',
      targetAmount: 200000,
      currentAmount: 75000,
      deadline: '2024-08-15',
      category: 'Travel',
    },
  ]);

  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
    category: 'Savings',
  });

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.deadline) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: 0,
      deadline: newGoal.deadline,
      category: newGoal.category,
    };

    setGoals([...goals, goal]);
    setNewGoal({ title: '', targetAmount: '', deadline: '', category: 'Savings' });
    setShowAddGoal(false);
    Alert.alert('Success', 'Goal added successfully!');
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Goals" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>

      {/* Add Goal Button */}
      <View style={styles.addButtonContainer}>
        <Button
          title="Add New Goal"
          onPress={() => setShowAddGoal(!showAddGoal)}
          style={styles.addButton}
        >
          <Plus size={20} color="#FFFFFF" />
        </Button>
      </View>

      {/* Add Goal Form */}
      {showAddGoal && (
        <Card style={styles.addGoalCard}>
          <Text style={[styles.addGoalTitle, { color: colors.text }]}>
            Create New Goal
          </Text>
          
          <Input
            label="Goal Title"
            value={newGoal.title}
            onChangeText={(text) => setNewGoal({ ...newGoal, title: text })}
            placeholder="e.g., Emergency Fund"
          />
          
          <Input
            label="Target Amount (₹)"
            value={newGoal.targetAmount}
            onChangeText={(text) => setNewGoal({ ...newGoal, targetAmount: text })}
            placeholder="e.g., 500000"
            keyboardType="numeric"
          />
          
          <Input
            label="Deadline"
            value={newGoal.deadline}
            onChangeText={(text) => setNewGoal({ ...newGoal, deadline: text })}
            placeholder="YYYY-MM-DD"
          />
          
          <View style={styles.formButtons}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setShowAddGoal(false)}
              style={styles.formButton}
            />
            <Button
              title="Add Goal"
              onPress={handleAddGoal}
              style={styles.formButton}
            />
          </View>
        </Card>
      )}

      {/* Goals List */}
      <View style={styles.goalsList}>
        {goals.map((goal) => {
          const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
          const daysRemaining = getDaysRemaining(goal.deadline);
          const isOverdue = daysRemaining < 0;
          
          return (
            <Card key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalInfo}>
                  <Text style={[styles.goalTitle, { color: colors.text }]}>
                    {goal.title}
                  </Text>
                  <Text style={[styles.goalCategory, { color: colors.textSecondary }]}>
                    {goal.category}
                  </Text>
                </View>
                <View style={[styles.goalIcon, { backgroundColor: colors.primary + '20' }]}>
                  <Target size={24} color={colors.primary} />
                </View>
              </View>

              <View style={styles.goalProgress}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressText, { color: colors.text }]}>
                    ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                  </Text>
                  <Text style={[styles.progressPercentage, { color: colors.primary }]}>
                    {progress.toFixed(1)}%
                  </Text>
                </View>
                
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: colors.primary,
                        width: `${progress}%`,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.goalFooter}>
                <View style={styles.deadlineContainer}>
                  <Calendar size={16} color={colors.textSecondary} />
                  <Text style={[
                    styles.deadlineText,
                    { 
                      color: isOverdue ? colors.error : colors.textSecondary 
                    }
                  ]}>
                    {isOverdue 
                      ? `Overdue by ${Math.abs(daysRemaining)} days`
                      : `${daysRemaining} days remaining`
                    }
                  </Text>
                </View>
                
                <TouchableOpacity style={styles.contributeButton}>
                  <DollarSign size={16} color={colors.primary} />
                  <Text style={[styles.contributeText, { color: colors.primary }]}>
                    Contribute
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          );
        })}
      </View>

      {/* Summary Card */}
      <Card style={styles.summaryCard}>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>
          Goals Summary
        </Text>
        
        <View style={styles.summaryStats}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {goals.length}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Total Goals
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.success }]}>
              {goals.filter(g => getProgressPercentage(g.currentAmount, g.targetAmount) >= 100).length}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Completed
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: colors.primary }]}>
              ₹{goals.reduce((sum, goal) => sum + goal.currentAmount, 0).toLocaleString()}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Total Saved
            </Text>
          </View>
        </View>
      </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    padding: 20,
    paddingBottom: 0,
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
  addButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addGoalCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  addGoalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  formButton: {
    flex: 1,
  },
  goalsList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  goalCard: {
    padding: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  goalCategory: {
    fontSize: 14,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalProgress: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deadlineText: {
    fontSize: 14,
  },
  contributeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  contributeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  summaryCard: {
    margin: 20,
    marginTop: 0,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
  },
});
