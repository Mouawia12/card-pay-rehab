import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'muted';
}

export const Card: React.FC<CardProps> = ({ children, style, variant = 'default' }) => {
  const cardStyle: ViewStyle[] = [styles.card];

  if (variant === 'muted') {
    cardStyle.push({ backgroundColor: Colors.light.muted + '80' });
  }

  return <View style={[cardStyle, Shadows.sm, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
});
