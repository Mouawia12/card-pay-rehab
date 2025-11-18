import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const CardTypes = () => {
  const { t } = useTranslation();
  
  const cardTypes = [
    {
      id: "stamps",
      title: t('cardTypes.stamps.title'),
      name: t('cardTypes.stamps.name'),
      description: t('cardTypes.stamps.description')
    },
    {
      id: "points",
      title: t('cardTypes.points.title'),
      name: t('cardTypes.points.name'),
      description: t('cardTypes.points.description')
    },
    {
      id: "cashback",
      title: t('cardTypes.cashback.title'),
      name: t('cardTypes.cashback.name'),
      description: t('cardTypes.cashback.description')
    },
    {
      id: "subscription",
      title: t('cardTypes.subscription.title'),
      name: t('cardTypes.subscription.name'),
      description: t('cardTypes.subscription.description')
    },
    {
      id: "discount",
      title: t('cardTypes.discount.title'),
      name: t('cardTypes.discount.name'),
      description: t('cardTypes.discount.description')
    },
    {
      id: "gift",
      title: t('cardTypes.gift.title'),
      name: t('cardTypes.gift.name'),
      description: t('cardTypes.gift.description')
    },
    {
      id: "membership",
      title: t('cardTypes.membership.title'),
      name: t('cardTypes.membership.name'),
      description: t('cardTypes.membership.description')
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-5xl font-bold mb-6"
          >
            {t('cardTypes.title')}
          </motion.h2>
        </div>

        <Tabs defaultValue="stamps" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-center gap-2 h-auto bg-secondary/50 p-4 mb-12">
            {cardTypes.map((card) => (
              <TabsTrigger
                key={card.id}
                value={card.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3 text-base font-semibold"
              >
                {card.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {cardTypes.map((card) => (
            <TabsContent key={card.id} value={card.id} className="mt-0">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                <div>
                  <img
                    src="https://loyapro.com/assets/guest/images/img.png"
                    alt={card.name}
                    className="w-80 h-auto rounded-2xl mx-auto"
                  />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-6">{card.name}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};
