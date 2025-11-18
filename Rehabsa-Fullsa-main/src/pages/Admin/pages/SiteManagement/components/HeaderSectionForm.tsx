import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HeaderContent } from "@/lib/siteContentStorage";
import type { TFunction } from "i18next";

interface HeaderSectionFormProps {
  data: HeaderContent;
  isRTL: boolean;
  t: TFunction;
  onChange: (value: HeaderContent) => void;
}

export function HeaderSectionForm({ data, isRTL, t, onChange }: HeaderSectionFormProps) {
  const updateField = (field: keyof HeaderContent) => (value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={isRTL ? "text-right" : "text-left"}>
          {t("admin.siteManagement.header.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="header-logo" className={isRTL ? "block text-right" : "block text-left"}>
            {t("admin.siteManagement.header.logoLabel")}
          </Label>
          <Input
            id="header-logo"
            value={data.logo || ""}
            onChange={(event) => updateField("logo")(event.target.value)}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="header-requestDemo" className={isRTL ? "block text-right" : "block text-left"}>
            {t("admin.siteManagement.header.requestDemoLabel")}
          </Label>
          <Input
            id="header-requestDemo"
            value={data.requestDemo || ""}
            onChange={(event) => updateField("requestDemo")(event.target.value)}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
      </CardContent>
    </Card>
  );
}

