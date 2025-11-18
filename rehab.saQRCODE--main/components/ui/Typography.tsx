import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Colors, FontSizes, FontWeights } from '@/constants/theme';
import { getTextStyle } from '@/utils/textDirection';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  style?: TextStyle;
  numberOfLines?: number;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  style,
  numberOfLines,
}) => {
  const textStyle: TextStyle[] = [styles.base];

  switch (variant) {
    case 'h1':
      textStyle.push(styles.h1);
      break;
    case 'h2':
      textStyle.push(styles.h2);
      break;
    case 'h3':
      textStyle.push(styles.h3);
      break;
    case 'body':
      textStyle.push(styles.body);
      break;
    case 'caption':
      textStyle.push(styles.caption);
      break;
    case 'label':
      textStyle.push(styles.label);
      break;
  }

  // Dynamic text alignment based on content
  const childrenText = typeof children === 'string' ? children : '';
  const dynamicStyle = childrenText ? getTextStyle(childrenText) : {};

  return (
    <Text style={[textStyle, dynamicStyle, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    color: Colors.light.foreground,
  },
  h1: {
    fontSize: FontSizes['3xl'],
    fontWeight: FontWeights.bold,
    lineHeight: 36,
  },
  h2: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    lineHeight: 30,
  },
  h3: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    lineHeight: 26,
  },
  body: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.normal,
    lineHeight: 22,
  },
  caption: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.normal,
    lineHeight: 20,
    color: Colors.light.mutedForeground,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    lineHeight: 20,
  },
});
