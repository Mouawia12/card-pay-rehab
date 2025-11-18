import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { Colors, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { getTextStyle } from '@/utils/textDirection';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  placeholder,
  value,
  ...props
}) => {
  // Dynamic text alignment based on content
  const labelStyle = label ? getTextStyle(label) : {};
  const errorStyle = error ? getTextStyle(error) : {};
  const inputStyle = value ? getTextStyle(value) : {};
  const placeholderStyle = placeholder ? getTextStyle(placeholder) : {};

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputContainerError]}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input, 
            leftIcon && styles.inputWithLeftIcon, 
            rightIcon && styles.inputWithRightIcon,
            inputStyle,
            style
          ]}
          placeholderTextColor={Colors.light.mutedForeground}
          textAlign={inputStyle.textAlign || (value ? undefined : placeholderStyle.textAlign)}
          placeholder={placeholder}
          value={value}
          {...props}
        />
        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
      </View>
      {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: Colors.light.foreground,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.lg,
    minHeight: 48,
  },
  inputContainerError: {
    borderColor: Colors.light.destructive,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.base,
    color: Colors.light.foreground,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIconContainer: {
    paddingLeft: 16,
  },
  rightIconContainer: {
    paddingRight: 16,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.light.destructive,
    marginTop: 4,
  },
});
