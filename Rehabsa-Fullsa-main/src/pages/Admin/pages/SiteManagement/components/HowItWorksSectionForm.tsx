import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { HowItWorksContent } from "@/lib/siteContentStorage";
import type { TFunction } from "i18next";

interface HowItWorksSectionFormProps {
  data: HowItWorksContent;
  isRTL: boolean;
  t: TFunction;
  onChange: (value: HowItWorksContent) => void;
}

export function HowItWorksSectionForm({ data, isRTL, t, onChange }: HowItWorksSectionFormProps) {
  const updateField = (field: keyof HowItWorksContent) => (
    value: string | HowItWorksContent["steps"],
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const updateStep = (index: number, field: "title" | "description", value: string) => {
    const steps = data.steps.map((step, stepIndex) =>
      stepIndex === index ? { ...step, [field]: value } : step,
    );
    updateField("steps")(steps);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={isRTL ? "text-right" : "text-left"}>
          {t("admin.siteManagement.howItWorks.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="howitworks-subtitle" className={isRTL ? "block text-right" : "block text-left"}>
            {t("admin.siteManagement.howItWorks.subtitleLabel")}
          </Label>
          <Input
            id="howitworks-subtitle"
            value={data.subtitle || ""}
            onChange={(event) => updateField("subtitle")(event.target.value)}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="howitworks-title" className={isRTL ? "block text-right" : "block text-left"}>
            {t("admin.siteManagement.howItWorks.titleLabel")}
          </Label>
          <Input
            id="howitworks-title"
            value={data.title || ""}
            onChange={(event) => updateField("title")(event.target.value)}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
        <div className="space-y-4">
          <Label className={isRTL ? "block text-right" : "block text-left"}>
            {t("admin.siteManagement.howItWorks.stepsLabel")}
          </Label>
          {data.steps.map((step, index) => (
            <Card key={step.number}>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label className={isRTL ? "block text-right" : "block text-left"}>
                    {t("admin.siteManagement.howItWorks.stepTitle")} {step.number}
                  </Label>
                  <Input
                    value={step.title || ""}
                    onChange={(event) => updateStep(index, "title", event.target.value)}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={isRTL ? "block text-right" : "block text-left"}>
                    {t("admin.siteManagement.howItWorks.stepDescription")} {step.number}
                  </Label>
                  <Textarea
                    value={step.description || ""}
                    onChange={(event) => updateStep(index, "description", event.target.value)}
                    dir={isRTL ? "rtl" : "ltr"}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

