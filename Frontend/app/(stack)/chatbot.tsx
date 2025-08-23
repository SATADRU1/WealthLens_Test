import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  Switch,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Card } from '@/components/Card';
import { chatbotApi, ChatMessage } from '@/services/chatbotApi';
import {
  Send,
  MessageCircle,
  History,
  Trash2,
  Bot,
  User,
  Plus,
  Search,
  Zap
} from 'lucide-react-native';

interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: Date;
}

export default function ChatbotScreen() {
  const { colors } = useTheme();
  const { isTablet, isDesktop } = useResponsive();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deepResearchMode, setDeepResearchMode] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('testing');
  const flatListRef = useRef<FlatList>(null);

  const styles = createStyles(isTablet, isDesktop);

  // Test backend connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      setConnectionStatus('testing');
      const isConnected = await chatbotApi.testConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    };

    testConnection();
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
      isDeepResearch: deepResearchMode,
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = inputText.trim();
    setInputText('');
    setIsLoading(true);

    try {
      // Call the backend API
      const aiResponseText = await chatbotApi.sendQuery(currentQuery, deepResearchMode);
      
      // Ensure the response is a string and handle any edge cases
      let responseText: string;
      if (typeof aiResponseText === 'string') {
        responseText = aiResponseText;
      } else if (aiResponseText && typeof aiResponseText === 'object') {
        // If it's an object, try to extract meaningful text
        const responseObj = aiResponseText as Record<string, any>;
        if ('answer' in responseObj && typeof responseObj.answer === 'string') {
          responseText = responseObj.answer;
        } else if ('message' in responseObj && typeof responseObj.message === 'string') {
          responseText = responseObj.message;
        } else {
          responseText = 'I received an unexpected response format. Please try again.';
        }
      } else {
        responseText = String(aiResponseText || 'No response received');
      }
      
      console.log('AI Response received:', { original: aiResponseText, processed: responseText });

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
        isDeepResearch: deepResearchMode,
      };

      setMessages(prev => [...prev, aiResponse]);

      // Update connection status if successful
      if (connectionStatus === 'disconnected') {
        setConnectionStatus('connected');
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Fallback response
      const fallbackResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: chatbotApi.getFallbackResponse(currentQuery),
        isUser: false,
        timestamp: new Date(),
        isDeepResearch: false,
      };

      setMessages(prev => [...prev, fallbackResponse]);
      setConnectionStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  const saveToHistory = () => {
    if (messages.length === 0) return;

    const firstUserMessage = messages.find(m => m.isUser);
    const title = firstUserMessage ? 
      firstUserMessage.text.substring(0, 50) + (firstUserMessage.text.length > 50 ? '...' : '') :
      'New Chat';

    const newHistory: ChatHistory = {
      id: Date.now().toString(),
      title,
      messages: [...messages],
      timestamp: new Date(),
    };

    setChatHistory(prev => [newHistory, ...prev]);
    setMessages([]);
  };

  const loadFromHistory = (historyItem: ChatHistory) => {
    setMessages(historyItem.messages);
    setShowHistory(false);
  };

  const deleteHistoryItem = (id: string) => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this chat history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setChatHistory(prev => prev.filter(item => item.id !== id));
          }
        },
      ]
    );
  };

  const clearCurrentChat = () => {
    if (messages.length > 0) {
      Alert.alert(
        'Clear Chat',
        'Do you want to save this conversation to history before clearing?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear Without Saving', style: 'destructive', onPress: () => setMessages([]) },
          { text: 'Save & Clear', onPress: () => { saveToHistory(); } },
        ]
      );
    }
  };

  const startNewChat = () => {
    if (messages.length > 0) {
      Alert.alert(
        'New Chat',
        'Do you want to save the current conversation to history before starting a new chat?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Start New Without Saving',
            style: 'destructive',
            onPress: () => setMessages([])
          },
          {
            text: 'Save & Start New',
            onPress: () => {
              saveToHistory();
            }
          },
        ]
      );
    } else {
      // If no messages, just ensure clean state
      setMessages([]);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      <View style={styles.messageHeader}>
        {item.isUser ? (
          <View style={styles.userIconContainer}>
            <User size={16} color={colors.primary} />
            {item.isDeepResearch && (
              <View style={[styles.deepResearchBadge, { backgroundColor: colors.primary }]}>
                <Zap size={10} color="white" />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.aiIconContainer}>
            <Bot size={16} color={colors.accent} />
            {item.isDeepResearch && (
              <View style={[styles.deepResearchBadge, { backgroundColor: colors.primary }]}>
                <Zap size={10} color="white" />
              </View>
            )}
          </View>
        )}
        <Text style={[styles.messageSender, { color: colors.textSecondary }]}>
          {item.isUser ? 'You' : 'AI Assistant'}
          {item.isDeepResearch && (
            <Text style={[styles.deepResearchLabel, { color: colors.primary }]}>
              {' • Deep Research'}
            </Text>
          )}
        </Text>
      </View>
      <Text style={[styles.messageText, { color: colors.text }]}>
        {typeof item.text === 'string' ? item.text : String(item.text)}
      </Text>
    </View>
  );

  const renderHistoryItem = ({ item }: { item: ChatHistory }) => (
    <View style={[styles.historyItem, { borderBottomColor: colors.border }]}>
      <TouchableOpacity
        style={styles.historyContent}
        onPress={() => loadFromHistory(item)}
      >
        <Text style={[styles.historyTitle, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.historyDate, { color: colors.textSecondary }]}>
          {item.timestamp.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={(e) => {
          e.stopPropagation();
          deleteHistoryItem(item.id);
        }}
      >
        <Trash2 size={16} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  if (showHistory) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowHistory(false)}
          >
            <Text style={[styles.backText, { color: colors.primary }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Chat History</Text>
          <TouchableOpacity
            style={styles.newChatButton}
            onPress={() => {
              setShowHistory(false);
              startNewChat();
            }}
          >
            <Plus size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={chatHistory}
          renderItem={renderHistoryItem}
          keyExtractor={item => item.id}
          style={styles.historyList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <History size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No chat history yet
              </Text>
            </View>
          }
        />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.titleContainer}>
            <MessageCircle size={24} color={colors.primary} />
            <View style={styles.titleText}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>AI Finance Assistant</Text>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: connectionStatus === 'connected' ? colors.success :
                                   connectionStatus === 'testing' ? colors.warning : colors.error }
                ]} />
                <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                  {connectionStatus === 'connected' ? 'Connected' :
                   connectionStatus === 'testing' ? 'Connecting...' : 'Offline'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.newChatButton}
            onPress={startNewChat}
          >
            <Plus size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => setShowHistory(true)}
          >
            <History size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          {messages.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearCurrentChat}
            >
              <Trash2 size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Deep Research Toggle */}
      <View style={[styles.deepResearchContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.deepResearchContent}>
          <View style={styles.deepResearchInfo}>
            <View style={[styles.deepResearchIcon, { backgroundColor: deepResearchMode ? colors.primary + '20' : colors.border }]}>
              {deepResearchMode ? (
                <Zap size={16} color={colors.primary} />
              ) : (
                <Search size={16} color={colors.textSecondary} />
              )}
            </View>
            <View style={styles.deepResearchText}>
              <Text style={[styles.deepResearchTitle, { color: colors.text }]}>
                Deep Research Mode
              </Text>
              <Text style={[styles.deepResearchSubtitle, { color: colors.textSecondary }]}>
                {deepResearchMode ? 'Enhanced AI analysis with web research' : 'Standard AI responses'}
              </Text>
            </View>
          </View>
          <Switch
            value={deepResearchMode}
            onValueChange={setDeepResearchMode}
            trackColor={{ false: colors.border, true: colors.primary + '40' }}
            thumbColor={deepResearchMode ? colors.primary : colors.textSecondary}
            ios_backgroundColor={colors.border}
          />
        </View>
      </View>

      {/* Chat Area */}
      {messages.length === 0 ? (
        <View style={styles.welcomeContainer}>
          <Card style={styles.welcomeCard}>
            <Text style={[styles.welcomeTitle, { color: colors.text }]}>
              AI Finance Assistant
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
              Ask any finance or investment-related questions.
            </Text>
            <Text style={[styles.welcomeDescription, { color: colors.textSecondary }]}>
              Start a conversation by typing a message below.
            </Text>
          </Card>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
        />
      )}

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              {deepResearchMode ? 'AI is conducting deep research...' : 'AI is typing...'}
            </Text>
            {deepResearchMode && (
              <View style={[styles.deepResearchIndicator, { backgroundColor: colors.primary + '20' }]}>
                <Zap size={12} color={colors.primary} />
                <Text style={[styles.deepResearchIndicatorText, { color: colors.primary }]}>
                  Deep Research
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Input Area */}
      <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.textInput, {
            backgroundColor: colors.background,
            borderColor: colors.border,
            color: colors.text
          }]}
          placeholder="e.g., What are the benefits of a Roth IRA?"
          placeholderTextColor={colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          style={[styles.sendButton, {
            backgroundColor: inputText.trim() ? colors.primary : colors.border
          }]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Send size={20} color={inputText.trim() ? '#FFFFFF' : colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Floating New Chat Button - only show when there are messages */}
      {messages.length > 0 && (
        <TouchableOpacity
          style={[styles.floatingNewChatButton, { backgroundColor: colors.primary }]}
          onPress={startNewChat}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const createStyles = (isTablet: boolean, isDesktop: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isTablet ? 24 : 16,
    paddingVertical: 12,
    paddingTop: isTablet ? 20 : 16,
  },
  headerLeft: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  newChatButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 20,
  },
  historyButton: {
    padding: 8,
  },
  clearButton: {
    padding: 8,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },

  // Deep Research Toggle
  deepResearchContainer: {
    paddingHorizontal: isTablet ? 24 : 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  deepResearchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deepResearchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deepResearchIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deepResearchText: {
    flex: 1,
  },
  deepResearchTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  deepResearchSubtitle: {
    fontSize: 12,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: isTablet ? 48 : 16,
    maxWidth: isDesktop ? 800 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  welcomeCard: {
    padding: isTablet ? 32 : 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: isTablet ? 20 : 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: isTablet ? 16 : 14,
    textAlign: 'center',
    lineHeight: isTablet ? 24 : 20,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: isTablet ? 24 : 16,
    paddingBottom: 8,
    maxWidth: isDesktop ? 800 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  messageContainer: {
    marginBottom: isTablet ? 20 : 16,
    maxWidth: isTablet ? '75%' : '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userIconContainer: {
    position: 'relative',
  },
  aiIconContainer: {
    position: 'relative',
  },
  deepResearchBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageSender: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  deepResearchLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  messageText: {
    fontSize: isTablet ? 16 : 15,
    lineHeight: isTablet ? 22 : 20,
    padding: isTablet ? 16 : 12,
    borderRadius: isTablet ? 16 : 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  loadingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  deepResearchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  deepResearchIndicatorText: {
    fontSize: 10,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: isTablet ? 24 : 16,
    paddingVertical: isTablet ? 16 : 12,
    borderTopWidth: 1,
    gap: isTablet ? 16 : 12,
    maxWidth: isDesktop ? 800 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: isTablet ? 24 : 20,
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 16 : 12,
    fontSize: isTablet ? 18 : 16,
    maxHeight: isTablet ? 120 : 100,
  },
  sendButton: {
    width: isTablet ? 48 : 40,
    height: isTablet ? 48 : 40,
    borderRadius: isTablet ? 24 : 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyList: {
    flex: 1,
    paddingHorizontal: isTablet ? 24 : 16,
    maxWidth: isDesktop ? 800 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: isTablet ? 20 : 16,
    borderBottomWidth: 1,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: isTablet ? 14 : 12,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
  floatingNewChatButton: {
    position: 'absolute',
    bottom: isTablet ? 120 : 100,
    right: isTablet ? 32 : 20,
    width: isTablet ? 64 : 56,
    height: isTablet ? 64 : 56,
    borderRadius: isTablet ? 32 : 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
