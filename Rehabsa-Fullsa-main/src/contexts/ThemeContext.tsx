import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeConfig, ColorScheme, loadThemeConfig, saveThemeConfig, defaultThemeConfig } from '@/lib/themeStorage';

interface ThemeContextType {
  theme: ThemeConfig;
  updateLogo: (type: 'website' | 'admin' | 'dashboard', logo: string) => void;
  updateColors: (type: 'website' | 'admin' | 'dashboard', colors: Partial<ColorScheme>) => void;
  resetTheme: () => void;
  applyTheme: (type: 'website' | 'admin' | 'dashboard') => void;
  getLogo: (type: 'website' | 'admin' | 'dashboard') => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(() => loadThemeConfig());

  // Load theme on mount
  useEffect(() => {
    const loadedTheme = loadThemeConfig();
    setTheme(loadedTheme);
    // Apply website theme by default
    applyThemeType('website', loadedTheme.colors.website);
  }, []);

  // Function to apply theme colors to CSS variables
  const applyThemeType = (type: 'website' | 'admin' | 'dashboard', colors: ColorScheme) => {
    const root = document.documentElement;

    // Apply colors directly to standard CSS variables (no prefix)
    // This ensures Tailwind uses the correct colors
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-foreground', colors.primaryForeground);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--secondary-foreground', colors.secondaryForeground);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--accent-foreground', colors.accentForeground);
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--foreground', colors.foreground);
    root.style.setProperty('--card', colors.card);
    root.style.setProperty('--card-foreground', colors.cardForeground);
    root.style.setProperty('--border', colors.border);
    root.style.setProperty('--input', colors.input);
    root.style.setProperty('--ring', colors.ring);
    root.style.setProperty('--muted', colors.muted);
    root.style.setProperty('--muted-foreground', colors.mutedForeground);
    root.style.setProperty('--destructive', colors.destructive);
    root.style.setProperty('--destructive-foreground', colors.destructiveForeground);
    
    // Sidebar colors
    if (colors.sidebarBackground) {
      root.style.setProperty('--sidebar-background', colors.sidebarBackground);
    }
    if (colors.sidebarForeground) {
      root.style.setProperty('--sidebar-foreground', colors.sidebarForeground);
    }
    if (colors.sidebarPrimary) {
      root.style.setProperty('--sidebar-primary', colors.sidebarPrimary);
    }
    if (colors.sidebarPrimaryForeground) {
      root.style.setProperty('--sidebar-primary-foreground', colors.sidebarPrimaryForeground);
    }
    if (colors.sidebarAccent) {
      root.style.setProperty('--sidebar-accent', colors.sidebarAccent);
    }
    if (colors.sidebarAccentForeground) {
      root.style.setProperty('--sidebar-accent-foreground', colors.sidebarAccentForeground);
    }
    if (colors.sidebarBorder) {
      root.style.setProperty('--sidebar-border', colors.sidebarBorder);
    }
    if (colors.sidebarRing) {
      root.style.setProperty('--sidebar-ring', colors.sidebarRing);
    }
  };

  const updateLogo = (type: 'website' | 'admin' | 'dashboard', logo: string) => {
    setTheme((prev) => {
      const updated = {
        ...prev,
        logos: {
          ...prev.logos,
          [type]: logo,
        },
      };
      saveThemeConfig(updated);
      return updated;
    });
  };

  const updateColors = (type: 'website' | 'admin' | 'dashboard', colors: Partial<ColorScheme>) => {
    setTheme((prev) => {
      const updated = {
        ...prev,
        colors: {
          ...prev.colors,
          [type]: {
            ...prev.colors[type],
            ...colors,
          },
        },
      };
      saveThemeConfig(updated);
      // Apply immediately
      applyThemeType(type, updated.colors[type]);
      return updated;
    });
  };

  const resetTheme = () => {
    setTheme(defaultThemeConfig);
    saveThemeConfig(defaultThemeConfig);
    applyThemeType('website', defaultThemeConfig.colors.website);
  };

  const applyTheme = (type: 'website' | 'admin' | 'dashboard') => {
    applyThemeType(type, theme.colors[type]);
  };

  const getLogo = (type: 'website' | 'admin' | 'dashboard'): string => {
    return theme.logos[type] || '/Logo.svg';
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        updateLogo,
        updateColors,
        resetTheme,
        applyTheme,
        getLogo,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

