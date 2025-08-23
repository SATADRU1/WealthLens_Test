import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function StackLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="currency-converter" options={{ title: 'Currency Converter' }} />
      <Stack.Screen name="ai-finance" options={{ title: 'AI Finance Tool' }} />
      <Stack.Screen name="learning-hub" options={{ title: 'Learning Hub' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="chatbot" options={{ title: 'AI Finance Assistant' }} />
    </Stack>
  );
}