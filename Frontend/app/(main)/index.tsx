import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function MainIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard when accessing main root
    router.replace('/(main)/dashboard');
  }, []);

  return null;
}
