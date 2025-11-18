import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { getSiteContent } from "@/lib/siteContentStorage";
import { useMemo } from "react";

export const HowItWorks = () => {
  const { t } = useTranslation();
  const { language } = useDirection();
  
  // Get content from localStorage or fallback to translations
  const howItWorksContent = useMemo(() => {
    try {
      const content = getSiteContent(language as 'ar' | 'en');
      return content.howItWorks;
    } catch {
      return {
        subtitle: t('howItWorks.subtitle'),
        title: t('howItWorks.title'),
        steps: [
          { number: "01", title: t('howItWorks.step1Title'), description: t('howItWorks.step1Description') },
          { number: "02", title: t('howItWorks.step2Title'), description: t('howItWorks.step2Description') },
          { number: "03", title: t('howItWorks.step3Title'), description: t('howItWorks.step3Description') },
        ],
        imageAlt: t('howItWorks.imageAlt'),
      };
    }
  }, [language, t]);
  
  const steps = howItWorksContent.steps;
  
  return (
    <section className="py-20 px-4 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
            {howItWorksContent.subtitle}
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold">{howItWorksContent.title}</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                 <div className="flex-shrink-0">
                   <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
                     <span className="text-white font-bold text-lg">
                       {step.number}
                     </span>
                   </div>
                 </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="relative">
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              src="https://loyapro.com/assets/guest/images/hand-holding-phone-with-qr-1.png"
              alt={howItWorksContent.imageAlt}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
