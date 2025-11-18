import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { getSiteContent } from "@/lib/siteContentStorage";
import { useMemo } from "react";

export const Hero = () => {
  const { t, i18n } = useTranslation();
  const { language } = useDirection();
  
  // Get content from localStorage or fallback to translations
  const heroContent = useMemo(() => {
    try {
      const content = getSiteContent(language as 'ar' | 'en');
      return content.hero;
    } catch {
      return {
        title: t('hero.title'),
        subtitle: t('hero.subtitle'),
        cta: t('hero.cta'),
        requestDemo: t('hero.requestDemo'),
      };
    }
  }, [language, t]);
  
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 gradient-bg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container-custom relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-block"
          >
            <Button variant="outline" className="rounded-full">
              {heroContent.requestDemo}
            </Button>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            {heroContent.title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {heroContent.subtitle}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center"
          >
            <Button 
              size="lg" 
              className="btn-primary rounded-full px-8 py-6 text-lg"
            >
              {heroContent.cta}
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
