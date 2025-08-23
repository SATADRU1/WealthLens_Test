import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive, getResponsiveFontSize, getResponsivePadding } from '@/hooks/useResponsive';
import { useChatHistory, Message, ChatHistory } from '@/hooks/useChatHistory';
import { Card } from '@/components/Card';
import {
  Send,
  Bot,
  User,
  History,
  Trash2,
  MessageSquare,
  Sparkles,
  TrendingUp,
  DollarSign,
  PieChart
} from 'lucide-react-native';

export default function AIFinanceScreen() {
  const { colors } = useTheme();
  const { isSmall, isTablet } = useResponsive();
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    chatHistory,
    currentChatId,
    createNewChat,
    addMessageToChat,
    deleteChat,
    loadChat,
    getCurrentChat,
  } = useChatHistory();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const suggestedQuestions = [
    {
      icon: TrendingUp,
      text: "What are the benefits of a Roth IRA?",
      color: colors.primary,
    },
    {
      icon: DollarSign,
      text: "How should I diversify my investment portfolio?",
      color: colors.success,
    },
    {
      icon: PieChart,
      text: "What's the best way to reduce my monthly expenses?",
      color: colors.accent,
    },
  ];

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    // Create new chat if none exists, or add to current chat
    let chatId = currentChatId;
    if (!chatId) {
      chatId = createNewChat(userMessage);
    } else {
      addMessageToChat(chatId, userMessage);
    }

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(userMessage.text),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      addMessageToChat(chatId!, aiResponse);
      setIsTyping(false);
    }, 1500);

    // Auto-scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const getAIResponse = (question: string): string => {
    const responses = [
      "Based on your financial profile, I'd recommend diversifying your portfolio across different asset classes. Consider allocating 60% to stocks, 30% to bonds, and 10% to alternative investments.",
      "A Roth IRA offers tax-free growth and withdrawals in retirement. You contribute after-tax dollars, but your investments grow tax-free, making it ideal for younger investors.",
      "To reduce monthly expenses, start by tracking all your spending for a month. Look for subscription services you don't use, consider cooking at home more often, and negotiate better rates for insurance and utilities.",
      "Emergency funds should cover 3-6 months of expenses. Keep this money in a high-yield savings account for easy access while earning some interest.",
      "Dollar-cost averaging is a great strategy for beginners. Invest a fixed amount regularly regardless of market conditions to reduce the impact of volatility.",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
  };

  const handleDeleteHistory = (historyId: string) => {
    Alert.alert(
      'Delete Chat History',
      'Are you sure you want to delete this chat history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteChat(historyId);
          }
        },
      ]
    );
  };

  const handleLoadHistory = (history: ChatHistory) => {
    loadChat(history.id);
    setMessages(history.messages);
    setShowHistory(false);
  };

  const handleNewChat = () => {
    setMessages([]);
    setShowHistory(false);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Simple Header with History Button */}
      <View style={[styles.simpleHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => setShowHistory(!showHistory)}
        >
          <History size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Chat History Sidebar */}
      {showHistory && (
        <View style={[styles.historySidebar, { backgroundColor: colors.surface, borderRightColor: colors.border }]}>
          <View style={styles.historyHeader}>
            <Text style={[styles.historyTitle, { color: colors.text }]}>
              Chat History
            </Text>
            <TouchableOpacity onPress={handleNewChat} style={[styles.newChatButton, { backgroundColor: colors.primary }]}>
              <MessageSquare size={16} color="#FFFFFF" />
              <Text style={styles.newChatText}>New Chat</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.historyList}>
            {chatHistory.map((chat) => (
              <View key={chat.id} style={[styles.historyItem, { borderBottomColor: colors.border }]}>
                <TouchableOpacity
                  style={styles.historyItemContent}
                  onPress={() => handleLoadHistory(chat)}
                >
                  <Text style={[styles.historyItemTitle, { color: colors.text }]} numberOfLines={2}>
                    {chat.title}
                  </Text>
                  <Text style={[styles.historyItemDate, { color: colors.textSecondary }]}>
                    {chat.lastUpdated.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteHistory(chat.id)}
                >
                  <Trash2 size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Main Chat Area */}
      <View style={[styles.chatArea, showHistory && styles.chatAreaWithHistory]}>
        {messages.length === 0 ? (
          /* Welcome Screen */
          <ScrollView style={styles.welcomeContainer} contentContainerStyle={styles.welcomeContent}>
            <View style={styles.welcomeHeader}>
              <View style={[styles.welcomeIcon, { backgroundColor: colors.primary + '20' }]}>
                <Sparkles size={48} color={colors.primary} />
              </View>
              <Text style={[styles.welcomeTitle, { color: colors.text }]}>
                AI Finance Tool
              </Text>
              <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
                Start a conversation by typing a message below.
              </Text>
            </View>

            <View style={styles.suggestedQuestions}>
              <Text style={[styles.suggestedTitle, { color: colors.text }]}>
                Suggested Questions
              </Text>
              {suggestedQuestions.map((question, index) => {
                const IconComponent = question.icon;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.suggestionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={() => handleSuggestedQuestion(question.text)}
                  >
                    <View style={[styles.suggestionIcon, { backgroundColor: question.color + '20' }]}>
                      <IconComponent size={20} color={question.color} />
                    </View>
                    <Text style={[styles.suggestionText, { color: colors.text }]}>
                      {question.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        ) : (
          /* Chat Messages */
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.isUser ? styles.userMessage : styles.aiMessage,
                ]}
              >
                <View style={[
                  styles.messageAvatar,
                  { backgroundColor: message.isUser ? colors.primary : colors.accent + '20' }
                ]}>
                  {message.isUser ? (
                    <User size={16} color="#FFFFFF" />
                  ) : (
                    <Bot size={16} color={colors.accent} />
                  )}
                </View>
                <View style={[
                  styles.messageBubble,
                  {
                    backgroundColor: message.isUser ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  }
                ]}>
                  <Text style={[
                    styles.messageText,
                    { color: message.isUser ? '#FFFFFF' : colors.text }
                  ]}>
                    {message.text}
                  </Text>
                  <Text style={[
                    styles.messageTime,
                    { color: message.isUser ? 'rgba(255,255,255,0.7)' : colors.textSecondary }
                  ]}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            ))}
            
            {isTyping && (
              <View style={[styles.messageContainer, styles.aiMessage]}>
                <View style={[styles.messageAvatar, { backgroundColor: colors.accent + '20' }]}>
                  <Bot size={16} color={colors.accent} />
                </View>
                <View style={[styles.messageBubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[styles.typingText, { color: colors.textSecondary }]}>
                    AI is typing...
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {/* Input Area */}
        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="e.g., What are the benefits of a Roth IRA?"
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { 
                  backgroundColor: inputText.trim() ? colors.primary : colors.border,
                  opacity: inputText.trim() ? 1 : 0.5,
                }
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
            >
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  simpleHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  historyButton: {
    padding: 8,
  },
  historySidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 300,
    borderRightWidth: 1,
    zIndex: 10,
    elevation: 5,
  },
  historyHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  newChatText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  historyItemContent: {
    flex: 1,
  },
  historyItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  historyItemDate: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
  },
  chatArea: {
    flex: 1,
  },
  chatAreaWithHistory: {
    marginRight: 300,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  welcomeHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  suggestedQuestions: {
    gap: 12,
  },
  suggestedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  suggestionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 100,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 10,
    textAlign: 'right',
  },
  typingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
