import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useDirection = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Default to LTR (English) if no language is set
    const currentLanguage = i18n.language || 'en';
    const isRTL = currentLanguage === 'ar';
    
    // Apply direction and language to document
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
    
    // Add/remove RTL class to body for Tailwind RTL utilities
    if (isRTL) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
    
    // Set default language to English if not set
    if (!i18n.language) {
      i18n.changeLanguage('en');
    }
  }, [i18n.language, i18n]);

  return {
    isRTL: (i18n.language || 'en') === 'ar',
    language: i18n.language || 'en',
    changeLanguage: i18n.changeLanguage,
  };
};
