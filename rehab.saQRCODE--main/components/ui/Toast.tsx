import { Provider as PaperProvider } from 'react-native-paper';
import React from 'react';

// Toast helper functions using react-native-paper
export const useToast = () => {
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    // This will be implemented with react-native-paper's Snackbar
    console.log(`${type.toUpperCase()}: ${message}`);
    // TODO: Implement with react-native-paper Snackbar component
  };

  const success = (message: string) => showToast(message, 'success');
  const error = (message: string) => showToast(message, 'error');
  const info = (message: string) => showToast(message, 'info');

  return { success, error, info };
};
