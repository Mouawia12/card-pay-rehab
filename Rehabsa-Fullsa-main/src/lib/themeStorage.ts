// Theme Storage Service
// Handles saving and loading theme configuration from localStorage

export interface ColorScheme {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  border: string;
  input: string;
  ring: string;
  muted: string;
  mutedForeground: string;
  destructive: string;
  destructiveForeground: string;
  // Sidebar specific colors
  sidebarBackground?: string;
  sidebarForeground?: string;
  sidebarPrimary?: string;
  sidebarPrimaryForeground?: string;
  sidebarAccent?: string;
  sidebarAccentForeground?: string;
  sidebarBorder?: string;
  sidebarRing?: string;
}

export interface ThemeConfig {
  logos: {
    website: string;
    admin: string;
    dashboard: string;
  };
  colors: {
    website: ColorScheme;
    admin: ColorScheme;
    dashboard: ColorScheme;
  };
}

const STORAGE_KEY = 'theme_config';
const DEFAULT_LOGO = '/Logo.svg';

// Default theme configuration
const defaultColors: ColorScheme = {
  primary: '180 100% 40%', // #00CEC2
  primaryForeground: '0 0% 100%',
  secondary: '210 35% 45%', // #447596
  secondaryForeground: '0 0% 100%',
  accent: '180 100% 40%',
  accentForeground: '0 0% 100%',
  background: '0 0% 100%',
  foreground: '220 50% 20%',
  card: '0 0% 100%',
  cardForeground: '220 50% 20%',
  border: '215 20% 85%',
  input: '215 20% 85%',
  ring: '180 100% 40%',
  muted: '215 20% 95%',
  mutedForeground: '215 20% 45%',
  destructive: '0 84% 60%',
  destructiveForeground: '0 0% 98%',
  sidebarBackground: '0 0% 98%',
  sidebarForeground: '220 50% 20%',
  sidebarPrimary: '180 100% 40%',
  sidebarPrimaryForeground: '0 0% 100%',
  sidebarAccent: '215 20% 95%',
  sidebarAccentForeground: '220 50% 20%',
  sidebarBorder: '215 20% 85%',
  sidebarRing: '180 100% 40%',
};

export const defaultThemeConfig: ThemeConfig = {
  logos: {
    website: DEFAULT_LOGO,
    admin: DEFAULT_LOGO,
    dashboard: DEFAULT_LOGO,
  },
  colors: {
    website: { ...defaultColors },
    admin: { ...defaultColors },
    dashboard: { ...defaultColors },
  },
};

// Load theme from localStorage
export const loadThemeConfig = (): ThemeConfig => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all properties exist
      return {
        logos: {
          website: parsed.logos?.website || DEFAULT_LOGO,
          admin: parsed.logos?.admin || DEFAULT_LOGO,
          dashboard: parsed.logos?.dashboard || DEFAULT_LOGO,
        },
        colors: {
          website: { ...defaultColors, ...parsed.colors?.website },
          admin: { ...defaultColors, ...parsed.colors?.admin },
          dashboard: { ...defaultColors, ...parsed.colors?.dashboard },
        },
      };
    }
  } catch (error) {
    console.error('Error loading theme config:', error);
  }
  return defaultThemeConfig;
};

// Save theme to localStorage
export const saveThemeConfig = (config: ThemeConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving theme config:', error);
  }
};

// Reset theme to defaults
export const resetThemeConfig = (): ThemeConfig => {
  saveThemeConfig(defaultThemeConfig);
  return defaultThemeConfig;
};

// Convert hex color to HSL format (for CSS variables)
export const hexToHsl = (hex: string): string => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lPercent = Math.round(l * 100);
  
  return `${h} ${s}% ${lPercent}%`;
};

// Convert HSL string to hex
export const hslToHex = (hsl: string): string => {
  const values = hsl.match(/\d+/g);
  if (!values || values.length < 3) return '#00CEC2';
  
  const h = parseInt(values[0]) / 360;
  const s = parseInt(values[1]) / 100;
  const l = parseInt(values[2]) / 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (h < 1/6) {
    r = c; g = x; b = 0;
  } else if (h < 2/6) {
    r = x; g = c; b = 0;
  } else if (h < 3/6) {
    r = 0; g = c; b = x;
  } else if (h < 4/6) {
    r = 0; g = x; b = c;
  } else if (h < 5/6) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
};

// Convert image file to base64
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

