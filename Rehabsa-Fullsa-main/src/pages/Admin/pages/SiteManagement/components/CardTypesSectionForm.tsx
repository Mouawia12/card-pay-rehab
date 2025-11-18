import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CardTypesContent } from "@/lib/siteContentStorage";
import type { TFunction } from "i18next";

interface CardTypesSectionFormProps {
  data: CardTypesContent;
  isRTL: boolean;
  t: TFunction;
  onChange: (value: CardTypesContent) => void;
}

export function CardTypesSectionForm({ data, isRTL, t, onChange }: CardTypesSectionFormProps) {
  const updateField = (field: keyof CardTypesContent) => (
    value: string | CardTypesContent["types"],
  ) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const updateType = (index: number, field: "title" | "name" | "description", value: string) => {
    const types = data.types.map((type, typeIndex) =>
      typeIndex === index ? { ...type, [field]: value } : type,
    );
    updateField("types")(types);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={isRTL ? "text-right" : "text-left"}>
          {t("admin.siteManagement.cardTypes.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardtypes-title" className={isRTL ? "block text-right" : "block text-left"}>
            {t("admin.siteManagement.cardTypes.titleLabel")}
          </Label>
          <Input
            id="cardtypes-title"
            value={data.title || ""}
            onChange={(event) => updateField("title")(event.target.value)}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
        <div className="space-y-4">
          <Label className={isRTL ? "block text-right" : "block text-left"}>
            {t("admin.siteManagement.cardTypes.typesLabel")}
          </Label>
          {data.types.map((type, index) => (
            <Card key={type.id}>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label className={isRTL ? "block text-right" : "block text-left"}>
                    {t("admin.siteManagement.cardTypes.typeTitle")} ({type.id})
                  </Label>
                  <Input
                    value={type.title || ""}
                    onChange={(event) => updateType(index, "title", event.target.value)}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={isRTL ? "block text-right" : "block text-left"}>
                    {t("admin.siteManagement.cardTypes.typeName")} ({type.id})
                  </Label>
                  <Input
                    value={type.name || ""}
                    onChange={(event) => updateType(index, "name", event.target.value)}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={isRTL ? "block text-right" : "block text-left"}>
                    {t("admin.siteManagement.cardTypes.typeDescription")} ({type.id})
                  </Label>
                  <Textarea
                    value={type.description || ""}
                    onChange={(event) => updateType(index, "description", event.target.value)}
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

