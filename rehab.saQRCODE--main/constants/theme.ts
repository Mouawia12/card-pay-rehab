/**
 * نظام الألوان والتصميم للتطبيق
 * مطابق للتصميم الأصلي من المشروع الويب
 */

import { Platform } from 'react-native';

// الألوان الأساسية - نظام التصميم الجديد
export const Colors = {
  light: {
    background: '#FFFFFF',
    foreground: '#1E293B',
    card: '#FFFFFF',
    cardForeground: '#1E293B',
    popover: '#FFFFFF',
    popoverForeground: '#1E293B',
    primary: '#00CEC2',
    primaryForeground: '#FFFFFF',
    secondary: '#447596',
    secondaryForeground: '#FFFFFF',
    muted: '#F3F4F6',
    mutedForeground: '#757575',
    accent: '#F3F4F6',
    accentForeground: '#1E293B',
    destructive: '#E85C5C',
    destructiveForeground: '#FFFFFF',
    border: '#D0D5DB',
    input: '#D0D5DB',
    ring: '#00CEC2',
    
    // Navigation specific
    tabIconDefault: '#757575',
    tabIconSelected: '#00CEC2',
  },
  dark: {
    background: '#0D1421',
    foreground: '#F9FAFB',
    card: '#1A2233',
    cardForeground: '#F9FAFB',
    popover: '#1A2233',
    popoverForeground: '#F9FAFB',
    primary: '#00CEC2',
    primaryForeground: '#FFFFFF',
    secondary: '#447596',
    secondaryForeground: '#FFFFFF',
    muted: '#2A3441',
    mutedForeground: '#9CA3AF',
    accent: '#2A3441',
    accentForeground: '#F9FAFB',
    destructive: '#A83636',
    destructiveForeground: '#FFFFFF',
    border: '#3A4455',
    input: '#3A4455',
    ring: '#00CEC2',
    
    // Navigation specific
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#00CEC2',
  },
};

// Border Radius مطابق للتصميم الأصلي
export const BorderRadius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// Spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

// Typography - خط Almarai
export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    mono: 'Courier',
  },
  android: {
    sans: 'normal',
    mono: 'monospace',
  },
  default: {
    sans: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Almarai, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Font Sizes
export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
};

// Font Weights - Almarai supports: 300, 400, 700, 800
export const FontWeights = {
  light: '300' as const,
  normal: '400' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

// Shadows
export const Shadows = Platform.select({
  ios: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
  },
  android: {
    sm: {
      elevation: 2,
    },
    md: {
      elevation: 4,
    },
    lg: {
      elevation: 8,
    },
  },
  default: {},
});

// Navigation Height
export const NAV_HEIGHT = 70;
