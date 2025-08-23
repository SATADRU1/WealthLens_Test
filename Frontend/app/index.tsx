import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function RootIndex() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace('/(main)/dashboard');
    } else {
      router.replace('/landing');
    }
  }, [user]);

  return null;
}
