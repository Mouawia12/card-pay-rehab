import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  icon,
}) => {
  const baseStyle: ViewStyle[] = [styles.base];
  const textStyle: TextStyle[] = [styles.text];

  // Variant styles
  switch (variant) {
    case 'default':
      baseStyle.push({ backgroundColor: Colors.light.primary });
      textStyle.push({ color: Colors.light.primaryForeground });
      break;
    case 'destructive':
      baseStyle.push({ backgroundColor: Colors.light.destructive });
      textStyle.push({ color: Colors.light.destructiveForeground });
      break;
    case 'outline':
      baseStyle.push({
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.light.border,
      });
      textStyle.push({ color: Colors.light.foreground });
      break;
    case 'ghost':
      baseStyle.push({ backgroundColor: 'transparent' });
      textStyle.push({ color: Colors.light.foreground });
      break;
  }

  // Size styles
  switch (size) {
    case 'sm':
      baseStyle.push({ paddingVertical: 8, paddingHorizontal: 12 });
      textStyle.push({ fontSize: FontSizes.sm });
      break;
    case 'md':
      baseStyle.push({ paddingVertical: 10, paddingHorizontal: 16 });
      textStyle.push({ fontSize: FontSizes.base });
      break;
    case 'lg':
      baseStyle.push({ paddingVertical: 14, paddingHorizontal: 24 });
      textStyle.push({ fontSize: FontSizes.lg });
      break;
  }

  // Disabled styles
  if (disabled || loading) {
    baseStyle.push({ opacity: 0.5 });
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[baseStyle, style]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={textStyle[textStyle.length - 1].color} />
      ) : (
        <>
          {icon && <>{icon}</>}
          {typeof children === 'string' ? (
            <Text style={textStyle}>{children}</Text>
          ) : (
            children
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontWeight: FontWeights.medium,
  },
});
