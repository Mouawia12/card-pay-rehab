import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StorageProvider } from '@/contexts/StorageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ScannerProvider } from '@/contexts/ScannerContext';
import { AuthGuard } from '@/components/AuthGuard';
import { Provider as PaperProvider } from 'react-native-paper';
import '@/i18n';

const queryClient = new QueryClient();

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const colorScheme = useColorScheme();

  return (
    <>
      <AuthGuard />
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
          <Stack.Screen name="verify-otp" options={{ headerShown: false }} />
          <Stack.Screen name="reset-password" options={{ headerShown: false }} />
          <Stack.Screen name="contact-us" options={{ headerShown: true }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </>
  );
}

export default function RootLayout() {
  // Conditionally wrap with AlertNotificationRoot only on mobile
  if (Platform.OS === 'web') {
    return (
      <LanguageProvider>
        <PaperProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <StorageProvider>
                <ScannerProvider>
                  <AppContent />
                </ScannerProvider>
              </StorageProvider>
            </AuthProvider>
          </QueryClientProvider>
        </PaperProvider>
      </LanguageProvider>
    );
  }

  // For mobile, use AlertNotificationRoot
  const { AlertNotificationRoot } = require('react-native-alert-notification');
  
  return (
    <AlertNotificationRoot>
      <LanguageProvider>
        <PaperProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <StorageProvider>
                <ScannerProvider>
                  <AppContent />
                </ScannerProvider>
              </StorageProvider>
            </AuthProvider>
          </QueryClientProvider>
        </PaperProvider>
      </LanguageProvider>
    </AlertNotificationRoot>
  );
}
