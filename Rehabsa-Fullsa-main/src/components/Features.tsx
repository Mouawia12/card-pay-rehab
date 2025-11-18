import { Smartphone, Watch, QrCode, Zap, Users, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { getSiteContent } from "@/lib/siteContentStorage";
import { useMemo } from "react";

const iconMap: Record<string, any> = {
  mobileCompatible: Smartphone,
  realTimeUpdates: Watch,
  easySetup: Zap,
  varietyCards: QrCode,
  analytics: Users,
  notifications: Bell,
};

const getFeatures = (t: any, featuresContent: any) => {
  return featuresContent.items.map((item: any) => ({
    icon: iconMap[item.key] || Smartphone,
    title: item.title,
    description: item.description
  }));
};

export const Features = () => {
  const { t } = useTranslation();
  const { language } = useDirection();
  
  // Get content from localStorage or fallback to translations
  const featuresContent = useMemo(() => {
    try {
      const content = getSiteContent(language as 'ar' | 'en');
      return content.features;
    } catch {
      return {
        title: t('features.title'),
        items: [
          { key: 'mobileCompatible', title: t('features.mobileCompatible.title'), description: t('features.mobileCompatible.description') },
          { key: 'realTimeUpdates', title: t('features.realTimeUpdates.title'), description: t('features.realTimeUpdates.description') },
          { key: 'easySetup', title: t('features.easySetup.title'), description: t('features.easySetup.description') },
          { key: 'varietyCards', title: t('features.varietyCards.title'), description: t('features.varietyCards.description') },
          { key: 'analytics', title: t('features.analytics.title'), description: t('features.analytics.description') },
          { key: 'notifications', title: t('features.notifications.title'), description: t('features.notifications.description') },
        ]
      };
    }
  }, [language, t]);
  
  const features = getFeatures(t, featuresContent);
  
  return (
    <section id="features" className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {featuresContent.title}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="p-8 hover:shadow-lg transition-all duration-300 border-2 h-full"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="h-7 w-7 text-inverse" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
