import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTheme } from "@/hooks/useTheme";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { getLogo } = useTheme();

  const handleSectionNavigation = (sectionId: string) => {
    // إذا كنا في الصفحة الرئيسية، انتقل إلى القسم مباشرة
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // إذا كنا في صفحة أخرى، انتقل إلى الصفحة الرئيسية ثم إلى القسم
      navigate('/');
      // انتظر قليلاً ثم انتقل إلى القسم
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    // إغلاق القائمة المحمولة إذا كانت مفتوحة
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b border-border z-50">
      <nav className="container-custom flex items-center justify-between h-20">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-16 h-16 flex items-center justify-center">
            <img 
              src={getLogo('website')} 
              alt={t('header.logo')} 
              className="h-12 w-auto"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => handleSectionNavigation('features')} 
            className="text-foreground hover:text-primary transition-colors"
          >
            {t('navigation.products')}
          </button>
          <button 
            onClick={() => handleSectionNavigation('pricing')} 
            className="text-foreground hover:text-primary transition-colors"
          >
            {t('navigation.pricing')}
          </button>
          <Link to="/blog" className="text-foreground hover:text-primary transition-colors">
            {t('navigation.blog')}
          </Link>
          <Link to="/about" className="text-foreground hover:text-primary transition-colors">
            {t('navigation.about')}
          </Link>
          <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
            {t('navigation.contact')}
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <Link to="/login">
            <Button className="btn-primary rounded-full px-6">
              {t('navigation.login')}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container-custom py-4 flex flex-col gap-4">
            <button 
              onClick={() => handleSectionNavigation('features')} 
              className="py-2 text-foreground hover:text-primary transition-colors text-left"
            >
              {t('navigation.products')}
            </button>
            <button 
              onClick={() => handleSectionNavigation('pricing')} 
              className="py-2 text-foreground hover:text-primary transition-colors text-left"
            >
              {t('navigation.pricing')}
            </button>
            <Link to="/blog" className="py-2 text-foreground hover:text-primary transition-colors">
              {t('navigation.blog')}
            </Link>
            <Link to="/about" className="py-2 text-foreground hover:text-primary transition-colors">
              {t('navigation.about')}
            </Link>
            <Link to="/contact" className="py-2 text-foreground hover:text-primary transition-colors">
              {t('navigation.contact')}
            </Link>
          <LanguageSwitcher />
          <Link to="/login">
            <Button className="btn-primary rounded-full">
              {t('navigation.login')}
            </Button>
          </Link>
          </div>
        </div>
      )}
    </header>
  );
};
