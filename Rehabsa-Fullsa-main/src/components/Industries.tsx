import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const Industries = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleContactClick = () => {
    navigate('/contact');
  };
  
  const industries = [
    {
      icon: "https://loyapro.com/assets/guest/images/icon-1.svg",
      name: t('industries.carWash')
    },
    {
      icon: "https://loyapro.com/assets/guest/images/icon-2.svg",
      name: t('industries.cafes')
    },
    {
      icon: "https://loyapro.com/assets/guest/images/icon-3.svg",
      name: t('industries.massageCenters')
    },
    {
      icon: "https://loyapro.com/assets/guest/images/icon-4.svg",
      name: t('industries.beautyCenters')
    },
    {
      icon: "https://loyapro.com/assets/guest/images/icon-5.svg",
      name: t('industries.restaurants')
    },
    {
      icon: "https://loyapro.com/assets/guest/images/icon-6.svg",
      name: t('industries.healthClinics')
    },
    {
      icon: "https://loyapro.com/assets/guest/images/icon-7.svg",
      name: t('industries.hairSalons')
    },
    {
      icon: "https://loyapro.com/assets/guest/images/icon-8.svg",
      name: t('industries.gyms')
    },
    {
      icon: "https://loyapro.com/assets/guest/images/icon-9.svg",
      name: t('industries.retailStores')
    },
    {
      icon: "https://loyapro.com/assets/guest/images/icon-10.svg",
      name: t('industries.more')
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold text-primary uppercase tracking-wide mb-4"
          >
            {t('industries.subtitle')}
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold mb-6"
          >
            {t('industries.title')}
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:bg-primary/5 hover:border-primary/20 border border-transparent"
            >
              <img
                src={industry.icon}
                alt={industry.name}
                className="w-16 h-16 mx-auto mb-4"
              />
              <p className="font-semibold text-sm group-hover:text-primary transition-colors duration-300">{industry.name}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button size="lg" className="font-bold group" onClick={handleContactClick}>
              {t('industries.contactButton')}
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
