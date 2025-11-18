import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PricingContent } from "@/lib/siteContentStorage";
import type { TFunction } from "i18next";

interface PricingSectionFormProps {
  data: PricingContent;
  isRTL: boolean;
  t: TFunction;
  onChange: (value: PricingContent) => void;
}

export function PricingSectionForm({ data, isRTL, t, onChange }: PricingSectionFormProps) {
  const updateField = (field: keyof PricingContent) => (
    value: string | PricingContent["plans"],
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const updatePlan = (index: number, patch: Partial<PricingContent["plans"][number]>) => {
    const plans = data.plans.map((plan, planIndex) =>
      planIndex === index ? { ...plan, ...patch } : plan,
    );
    updateField("plans")(plans);
  };

  const updateFeature = (planIndex: number, featureIndex: number, text: string) => {
    const features = data.plans[planIndex].features.map((feature, itemIndex) =>
      itemIndex === featureIndex ? { ...feature, text } : feature,
    );
    updatePlan(planIndex, { features });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={isRTL ? "text-right" : "text-left"}>
          {t("admin.siteManagement.pricing.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="pricing-title" className={isRTL ? "block text-right" : "block text-left"}>
            {t("admin.siteManagement.pricing.titleLabel")}
          </Label>
          <Input
            id="pricing-title"
            value={data.title || ""}
            onChange={(event) => updateField("title")(event.target.value)}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pricing-subtitle" className={isRTL ? "block text-right" : "block text-left"}>
            {t("admin.siteManagement.pricing.subtitleLabel")}
          </Label>
          <Input
            id="pricing-subtitle"
            value={data.subtitle || ""}
            onChange={(event) => updateField("subtitle")(event.target.value)}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {data.plans.map((plan, planIndex) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle className={isRTL ? "text-right" : "text-left"}>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className={isRTL ? "block text-right" : "block text-left"}>
                    {t("admin.siteManagement.pricing.planName")}
                  </Label>
                  <Input
                    value={plan.name || ""}
                    onChange={(event) => updatePlan(planIndex, { name: event.target.value })}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={isRTL ? "block text-right" : "block text-left"}>
                    {t("admin.siteManagement.pricing.planPrice")}
                  </Label>
                  <Input
                    value={plan.price || ""}
                    onChange={(event) => updatePlan(planIndex, { price: event.target.value })}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={isRTL ? "block text-right" : "block text-left"}>
                    {t("admin.siteManagement.pricing.planPeriod")}
                  </Label>
                  <Input
                    value={plan.period || ""}
                    onChange={(event) => updatePlan(planIndex, { period: event.target.value })}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={isRTL ? "block text-right" : "block text-left"}>
                    {t("admin.siteManagement.pricing.planFeatures")}
                  </Label>
                  {plan.features.map((feature, featureIndex) => (
                    <Input
                      key={feature.key}
                      value={feature.text || ""}
                      onChange={(event) => updateFeature(planIndex, featureIndex, event.target.value)}
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

