import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { isRTL } = useDirection();

  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const normalizedLang = (i18n.language || 'en').split('-')[0];
  const currentLanguage = languages.find(lang => lang.code === normalizedLang) 
    || languages.find(lang => lang.code === 'en') 
    || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <Globe className="h-4 w-4" />
          <span className={`hidden sm:inline ${isRTL ? 'text-right' : 'text-left'}`}>{currentLanguage.flag} {currentLanguage.name}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`cursor-pointer ${i18n.language === language.code ? 'bg-accent' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <span className={isRTL ? "ml-2" : "mr-2"}>{language.flag}</span>
            <span className={isRTL ? 'text-right' : 'text-left'}>{language.name}</span>
            {i18n.language === language.code && (
              <span className={`${isRTL ? 'ml-auto' : 'mr-auto'} text-primary`}>✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
