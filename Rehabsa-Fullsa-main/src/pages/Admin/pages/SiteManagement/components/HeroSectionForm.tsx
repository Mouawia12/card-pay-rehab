import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { HeroContent } from "@/lib/siteContentStorage";
import type { TFunction } from "i18next";

interface HeroSectionFormProps {
  data: HeroContent;
  isRTL: boolean;
  t: TFunction;
  onChange: (value: HeroContent) => void;
}

export function HeroSectionForm({ data, isRTL, t, onChange }: HeroSectionFormProps) {
  const updateField = (field: keyof HeroContent) => (value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className={isRTL ? "text-right" : "text-left"}>
          {t("admin.siteManagement.hero.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="hero-title" className={isRTL ? "block text-right" : "block text-left"}>
                {t("admin.siteManagement.hero.titleLabel")}
              </Label>
              <Input
                id="hero-title"
                value={data.title || ""}
                onChange={(event) => updateField("title")(event.target.value)}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-cta" className={isRTL ? "block text-right" : "block text-left"}>
                {t("admin.siteManagement.hero.ctaLabel")}
              </Label>
              <Input
                id="hero-cta"
                value={data.cta || ""}
                onChange={(event) => updateField("cta")(event.target.value)}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="hero-subtitle" className={isRTL ? "block text-right" : "block text-left"}>
                {t("admin.siteManagement.hero.subtitleLabel")}
              </Label>
              <Textarea
                id="hero-subtitle"
                value={data.subtitle || ""}
                onChange={(event) => updateField("subtitle")(event.target.value)}
                dir={isRTL ? "rtl" : "ltr"}
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-requestDemo" className={isRTL ? "block text-right" : "block text-left"}>
                {t("admin.siteManagement.hero.requestDemoLabel")}
              </Label>
              <Input
                id="hero-requestDemo"
                value={data.requestDemo || ""}
                onChange={(event) => updateField("requestDemo")(event.target.value)}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

