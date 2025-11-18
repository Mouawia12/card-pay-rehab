import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import i18n from '@/i18n';

const LANGUAGE_STORAGE_KEY = 'REHAB_QR_LANGUAGE';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved language on mount
  useEffect(() => {
    loadLanguage();
  }, []);

  // Update RTL/LTR and i18n when language changes
  useEffect(() => {
    if (isInitialized) {
      updateRTL(language);
      i18n.changeLanguage(language);
    }
  }, [language, isInitialized]);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage === 'ar' || savedLanguage === 'en') {
        setLanguageState(savedLanguage);
        updateRTL(savedLanguage);
        i18n.changeLanguage(savedLanguage);
      } else {
        // Default to Arabic
        setLanguageState('ar');
        updateRTL('ar');
        i18n.changeLanguage('ar');
      }
    } catch (error) {
      console.error('Error loading language:', error);
      setLanguageState('ar');
      updateRTL('ar');
      i18n.changeLanguage('ar');
    } finally {
      setIsInitialized(true);
    }
  };

  const updateRTL = (lang: Language) => {
    const isRTL = lang === 'ar';
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
      I18nManager.allowRTL(true);
      // Note: Reload may be needed for some platforms, but React Native should update automatically
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguageState(lang);
      updateRTL(lang);
      i18n.changeLanguage(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    isRTL: language === 'ar',
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
