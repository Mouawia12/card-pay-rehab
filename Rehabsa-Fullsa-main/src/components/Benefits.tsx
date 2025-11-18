import { Heart, TrendingUp, Sparkles, Clock, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const getBenefits = (t: any) => [
  {
    icon: Heart,
    title: t('benefits.customerRetention.title'),
    description: t('benefits.customerRetention.description')
  },
  {
    icon: TrendingUp,
    title: t('benefits.increaseSales.title'),
    description: t('benefits.increaseSales.description')
  },
  {
    icon: Sparkles,
    title: t('benefits.improveExperience.title'),
    description: t('benefits.improveExperience.description')
  },
  {
    icon: Clock,
    title: t('benefits.saveTimeMoney.title'),
    description: t('benefits.saveTimeMoney.description')
  },
  {
    icon: MessageSquare,
    title: t('benefits.directCommunication.title'),
    description: t('benefits.directCommunication.description')
  }
];

export const Benefits = () => {
  const { t } = useTranslation();
  const benefits = getBenefits(t);
  
  return (
    <section className="section-padding gradient-bg">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t('benefits.title')}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background/60 backdrop-blur-sm p-8 rounded-2xl border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-xl"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center mb-6">
                <benefit.icon className="h-8 w-8 text-inverse" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
