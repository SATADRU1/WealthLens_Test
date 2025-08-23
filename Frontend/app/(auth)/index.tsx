import { useEffect } from 'react';
import { router } from 'expo-router';

export default function AuthIndex() {
  useEffect(() => {
    // Redirect to login when accessing auth root
    router.replace('/(auth)/login');
  }, []);

  return null;
}
