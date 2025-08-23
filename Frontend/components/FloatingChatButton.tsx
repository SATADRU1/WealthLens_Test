import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { MessageCircle, X, Sparkles } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface FloatingChatButtonProps {
  style?: any;
}

export function FloatingChatButton({ style }: FloatingChatButtonProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for attention
  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  const handlePress = () => {
    // Scale animation on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to chatbot
    router.push('/(stack)/chatbot');
  };

  const handleLongPress = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              { scale: scaleAnim },
              { scale: pulseAnim },
            ],
          },
          style,
        ]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
            },
          ]}
          onPress={handlePress}
          onLongPress={handleLongPress}
          activeOpacity={0.8}
        >
          {/* Sparkle effect */}
          <View style={[styles.sparkleContainer, { backgroundColor: colors.primary + '20' }]}>
            <Sparkles size={12} color={colors.primary} style={styles.sparkle} />
          </View>
          
          {/* Main chat icon */}
          <MessageCircle size={28} color="white" />
          
          {/* Notification dot */}
          <View style={[styles.notificationDot, { backgroundColor: colors.error }]}>
            <Text style={styles.notificationText}>AI</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Tooltip Modal */}
      <Modal
        visible={showTooltip}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTooltip(false)}
      >
        <View style={styles.tooltipOverlay}>
          <View style={[styles.tooltip, { backgroundColor: colors.surface }]}>
            <Text style={[styles.tooltipText, { color: colors.text }]}>
              💬 AI Finance Assistant
            </Text>
            <Text style={[styles.tooltipSubtext, { color: colors.textSecondary }]}>
              Ask me anything about finance!
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    right: 20,
    zIndex: 1000,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
  },
  sparkleContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkle: {
    opacity: 0.8,
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  notificationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tooltipOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 20,
    paddingBottom: Platform.OS === 'ios' ? 180 : 160,
  },
  tooltip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    maxWidth: 200,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tooltipText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  tooltipSubtext: {
    fontSize: 12,
  },
});
