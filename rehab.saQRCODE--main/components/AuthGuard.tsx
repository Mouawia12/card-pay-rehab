import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export const AuthGuard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for auth check to complete

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'forgot-password' || segments[0] === 'verify-otp' || segments[0] === 'reset-password' || segments[0] === 'contact-us';
    const isContactUs = segments[0] === 'contact-us';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated and not already on auth pages
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup && !isContactUs) {
      // Redirect to home if authenticated and on auth pages (except contact-us)
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  return null;
};
