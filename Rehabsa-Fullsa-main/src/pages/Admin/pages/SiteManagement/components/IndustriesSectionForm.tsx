import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IndustriesContent } from "@/lib/siteContentStorage";
import type { TFunction } from "i18next";

interface IndustriesSectionFormProps {
  data: IndustriesContent;
  isRTL: boolean;
  t: TFunction;
  onChange: (value: IndustriesContent) => void;
}

export function IndustriesSectionForm({ data, isRTL, t, onChange }: IndustriesSectionFormProps) {
  const updateField = (field: keyof IndustriesContent) => (
    value: string | IndustriesContent["items"],
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const updateItem = (index: number, value: string) => {
    const items = data.items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, name: value } : item,
    );
    updateField("items")(items);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={isRTL ? "text-right" : "text-left"}>
          {t("admin.siteManagement.industries.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="industries-subtitle" className={isRTL ? "block text-right" : "block text-left"}>
            {t("admin.siteManagement.industries.subtitleLabel")}
          </Label>
          <Input
            id="industries-subtitle"
            value={data.subtitle || ""}
            onChange={(event) => updateField("subtitle")(event.target.value)}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industries-title" className={isRTL ? "block text-right" : "block text-left"}>
            {t("admin.siteManagement.industries.titleLabel")}
          </Label>
          <Input
            id="industries-title"
            value={data.title || ""}
            onChange={(event) => updateField("title")(event.target.value)}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industries-contactButton" className={isRTL ? "block text-right" : "block text-left"}>
            {t("admin.siteManagement.industries.contactButtonLabel")}
          </Label>
          <Input
            id="industries-contactButton"
            value={data.contactButton || ""}
            onChange={(event) => updateField("contactButton")(event.target.value)}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
        <div className="space-y-4">
          <Label className={isRTL ? "block text-right" : "block text-left"}>
            {t("admin.siteManagement.industries.itemsLabel")}
          </Label>
          {data.items.map((item, index) => (
            <Card key={item.key}>
              <CardContent className="pt-6 space-y-2">
                <Label className={isRTL ? "block text-right" : "block text-left"}>{item.key}</Label>
                <Input
                  value={item.name || ""}
                  onChange={(event) => updateItem(index, event.target.value)}
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

