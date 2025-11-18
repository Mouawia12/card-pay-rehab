import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faRocket, faStar } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useDirection } from "@/hooks/useDirection";

type Plan = {
  id: string;
  name: string;
  icon: IconDefinition;
  price: string;
  period?: string;
  featured?: boolean;
  features: string[];
  extras?: {
    title: string;
    items: string[];
  };
};

const getPlans = (t: any): Plan[] => [
  {
    id: "basic",
    name: t("pricing.basic.name"),
    icon: faBullseye,
    price: "1000",
    period: t("pricing.basic.period"),
    features: [
      t("pricing.basic.features.cardTypes"),
      t("pricing.basic.features.managers"),
      t("pricing.basic.features.branches"),
      t("pricing.basic.features.unlimitedCards"),
      t("pricing.basic.features.unlimitedNotifications"),
      t("pricing.basic.features.welcomeFeature"),
      t("pricing.basic.features.support"),
    ],
  },
  {
    id: "advanced",
    name: t("pricing.advanced.name"),
    icon: faRocket,
    price: "2000",
    period: t("pricing.advanced.period"),
    featured: true,
    features: [
      t("pricing.advanced.features.cardTypes"),
      t("pricing.advanced.features.managers"),
      t("pricing.advanced.features.branches"),
      t("pricing.advanced.features.unlimitedCards"),
      t("pricing.advanced.features.unlimitedNotifications"),
      t("pricing.advanced.features.welcomeFeature"),
      t("pricing.advanced.features.support"),
    ],
    extras: {
      title: t("pricing.advanced.extras.title"),
      items: [
        t("pricing.advanced.extras.items.prioritySupport"),
        t("pricing.advanced.extras.items.dedicatedSuccess"),
      ],
    },
  },
  {
    id: "premium",
    name: t("pricing.premium.name"),
    icon: faStar,
    price: t("pricing.premium.price"),
    period: "",
    features: [
      t("pricing.premium.features.cardTypes"),
      t("pricing.premium.features.managers"),
      t("pricing.premium.features.branches"),
      t("pricing.premium.features.unlimitedCards"),
      t("pricing.premium.features.unlimitedNotifications"),
      t("pricing.premium.features.welcomeFeature"),
      t("pricing.premium.features.support"),
    ],
  },
];

export const Pricing = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const plans = getPlans(t);

  return (
    <section id="pricing" className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t("pricing.title")}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("pricing.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`relative h-full p-6 md:p-7 hover:shadow-2xl transition-all duration-300 ${
                  plan.featured ? "border-4 border-primary" : "border-2"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-5 py-2 rounded-full text-xs md:text-sm font-bold">
                    {t("pricing.mostPopular")}
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="mb-4 flex justify-center">
                    <FontAwesomeIcon icon={plan.icon} className="text-4xl text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold mb-1">{plan.price}</div>
                  {plan.period && (
                    <div className="text-muted-foreground text-sm">/{plan.period}</div>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className={`text-sm leading-relaxed ${
                        isRTL ? "text-left" : "text-right"
                      }`}
                    >
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.extras && (
                  <div
                    className={`mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 ${
                      isRTL ? "text-left" : "text-right"
                    }`}
                  >
                    <h4 className="text-sm font-semibold text-primary mb-3">
                      {plan.extras.title}
                    </h4>
                    <ul className="space-y-2">
                      {plan.extras.items.map((item, extrasIdx) => (
                        <li
                          key={extrasIdx}
                          className={`text-sm leading-relaxed ${
                            isRTL ? "text-left" : "text-right"
                          }`}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {plan.price === t("pricing.premium.price") ? (
                  <Button className="w-full rounded-full py-4 btn-primary" asChild>
                    <Link to="/contact">{t("pricing.contactUs")}</Link>
                  </Button>
                ) : (
                  <Button
                    className={`w-full rounded-full py-4 ${
                      plan.featured
                        ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground"
                        : "btn-primary"
                    }`}
                    asChild
                  >
                    <Link to={`/subscribe/${plan.id}`}>{t("pricing.getStarted")}</Link>
                  </Button>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
