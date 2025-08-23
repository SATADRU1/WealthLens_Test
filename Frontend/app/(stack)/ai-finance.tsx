import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/Card';
import { Send, Bot, User } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export default function AIFinanceScreen() {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI finance assistant. I can help you with investment advice, budgeting tips, and financial planning. What would you like to know?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsThinking(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText),
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsThinking(false);
    }, 2000);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('invest') || input.includes('stock')) {
      return "For investment advice, I recommend diversifying your portfolio across different asset classes. Consider index funds for beginners as they offer broad market exposure with lower risk. Always invest money you can afford to lose and consider your investment timeline.";
    }
    
    if (input.includes('budget') || input.includes('save')) {
      return "Creating a budget is essential for financial health. Try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment. Track your expenses for a month to understand your spending patterns better.";
    }
    
    if (input.includes('debt') || input.includes('loan')) {
      return "To manage debt effectively, list all your debts and prioritize them by interest rate (avalanche method) or balance size (snowball method). Consider consolidating high-interest debt and always make at least minimum payments to avoid penalties.";
    }
    
    if (input.includes('emergency fund')) {
      return "An emergency fund should cover 3-6 months of living expenses. Start small - even $500 can help with unexpected expenses. Keep this fund in a high-yield savings account that's easily accessible but separate from your checking account.";
    }
    
    return "That's a great question! For personalized financial advice, I'd recommend considering your specific financial situation, goals, and risk tolerance. Would you like to discuss any particular aspect of your finances in more detail?";
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <View style={[
              styles.avatar,
              { backgroundColor: message.isUser ? colors.primary + '20' : colors.accent + '20' }
            ]}>
              {message.isUser ? (
                <User size={16} color={message.isUser ? colors.primary : colors.accent} />
              ) : (
                <Bot size={16} color={colors.accent} />
              )}
            </View>
            
            <Card style={[
              styles.messageBubble,
              {
                backgroundColor: message.isUser ? colors.primary : colors.surface,
                marginLeft: message.isUser ? 50 : 0,
                marginRight: message.isUser ? 0 : 50,
              },
            ]}>
              <Text style={[
                styles.messageText,
                { color: message.isUser ? '#FFFFFF' : colors.text }
              ]}>
                {message.text}
              </Text>
              <Text style={[
                styles.timestamp,
                { color: message.isUser ? '#FFFFFF80' : colors.textSecondary }
              ]}>
                {message.timestamp}
              </Text>
            </Card>
          </View>
        ))}

        {isThinking && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <View style={[styles.avatar, { backgroundColor: colors.accent + '20' }]}>
              <Bot size={16} color={colors.accent} />
            </View>
            <Card style={[styles.messageBubble, { backgroundColor: colors.surface, marginRight: 50 }]}>
              <Text style={[styles.thinkingText, { color: colors.textSecondary }]}>
                AI is thinking...
              </Text>
            </Card>
          </View>
        )}
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.textInput, { color: colors.text, backgroundColor: colors.background }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask me anything about finance..."
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={handleSend}
          disabled={inputText.trim() === '' || isThinking}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  messageBubble: {
    flex: 1,
    marginHorizontal: 8,
    padding: 12,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 10,
    textAlign: 'right',
  },
  thinkingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});