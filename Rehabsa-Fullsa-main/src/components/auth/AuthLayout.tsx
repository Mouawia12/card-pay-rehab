import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTheme } from "@/hooks/useTheme";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  const { t } = useTranslation();
  const { getLogo } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center p-4 relative">
      {/* Language Switcher in top right */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <img
              src={getLogo('website')}
              alt={t('header.logo')}
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground text-sm">
              {subtitle}
            </p>
          )}
        </div>

        {/* Auth Form Card */}
        <div className="bg-card rounded-lg shadow-lg border border-border p-6">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </div>
  );
};
