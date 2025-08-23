import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

const CHAT_HISTORY_KEY = 'chat_history';

export function useChatHistory() {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Load chat history from storage
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const history = parsed.map((chat: any) => ({
          ...chat,
          lastUpdated: new Date(chat.lastUpdated),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        setChatHistory(history);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const saveChatHistory = async (history: ChatHistory[]) => {
    try {
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  const createNewChat = (firstMessage?: Message): string => {
    const chatId = Date.now().toString();
    const title = firstMessage 
      ? firstMessage.text.slice(0, 50) + (firstMessage.text.length > 50 ? '...' : '')
      : 'New Chat';
    
    const newChat: ChatHistory = {
      id: chatId,
      title,
      messages: firstMessage ? [firstMessage] : [],
      lastUpdated: new Date(),
    };

    const updatedHistory = [newChat, ...chatHistory];
    setChatHistory(updatedHistory);
    saveChatHistory(updatedHistory);
    setCurrentChatId(chatId);
    
    return chatId;
  };

  const addMessageToChat = (chatId: string, message: Message) => {
    const updatedHistory = chatHistory.map(chat => {
      if (chat.id === chatId) {
        const updatedMessages = [...chat.messages, message];
        return {
          ...chat,
          messages: updatedMessages,
          lastUpdated: new Date(),
          // Update title if this is the first user message
          title: chat.messages.length === 0 && message.isUser 
            ? message.text.slice(0, 50) + (message.text.length > 50 ? '...' : '')
            : chat.title,
        };
      }
      return chat;
    });

    setChatHistory(updatedHistory);
    saveChatHistory(updatedHistory);
  };

  const deleteChat = (chatId: string) => {
    const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
    setChatHistory(updatedHistory);
    saveChatHistory(updatedHistory);
    
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  };

  const loadChat = (chatId: string): ChatHistory | null => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      return chat;
    }
    return null;
  };

  const getCurrentChat = (): ChatHistory | null => {
    if (!currentChatId) return null;
    return chatHistory.find(c => c.id === currentChatId) || null;
  };

  const clearAllHistory = async () => {
    try {
      await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
      setChatHistory([]);
      setCurrentChatId(null);
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  };

  const updateChatTitle = (chatId: string, newTitle: string) => {
    const updatedHistory = chatHistory.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          title: newTitle,
          lastUpdated: new Date(),
        };
      }
      return chat;
    });

    setChatHistory(updatedHistory);
    saveChatHistory(updatedHistory);
  };

  return {
    chatHistory,
    currentChatId,
    createNewChat,
    addMessageToChat,
    deleteChat,
    loadChat,
    getCurrentChat,
    clearAllHistory,
    updateChatTitle,
    setCurrentChatId,
  };
}
