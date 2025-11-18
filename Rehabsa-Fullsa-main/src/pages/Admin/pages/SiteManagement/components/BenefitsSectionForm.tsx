import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BenefitsContent } from "@/lib/siteContentStorage";
import type { TFunction } from "i18next";

interface BenefitsSectionFormProps {
  data: BenefitsContent;
  isRTL: boolean;
  t: TFunction;
  onChange: (value: BenefitsContent) => void;
}

export function BenefitsSectionForm({ data, isRTL, t, onChange }: BenefitsSectionFormProps) {
  const updateField = (field: keyof BenefitsContent) => (
    value: string | BenefitsContent["items"],
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const updateItem = (index: number, field: "title" | "description", value: string) => {
    const items = data.items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item,
    );
    updateField("items")(items);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={isRTL ? "text-right" : "text-left"}>
          {t("admin.siteManagement.benefits.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="benefits-title" className={isRTL ? "block text-right" : "block text-left"}>
            {t("admin.siteManagement.benefits.titleLabel")}
          </Label>
          <Input
            id="benefits-title"
            value={data.title || ""}
            onChange={(event) => updateField("title")(event.target.value)}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
        <div className="space-y-4">
          <Label className={isRTL ? "block text-right" : "block text-left"}>
            {t("admin.siteManagement.benefits.itemsLabel")}
          </Label>
          {data.items.map((item, index) => (
            <Card key={item.key}>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label className={isRTL ? "block text-right" : "block text-left"}>
                    {t("admin.siteManagement.benefits.itemTitle")} {index + 1}
                  </Label>
                  <Input
                    value={item.title || ""}
                    onChange={(event) => updateItem(index, "title", event.target.value)}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={isRTL ? "block text-right" : "block text-left"}>
                    {t("admin.siteManagement.benefits.itemDescription")} {index + 1}
                  </Label>
                  <Textarea
                    value={item.description || ""}
                    onChange={(event) => updateItem(index, "description", event.target.value)}
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

