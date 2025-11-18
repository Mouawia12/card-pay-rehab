import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FooterContent } from "@/lib/siteContentStorage";
import type { TFunction } from "i18next";

interface FooterSectionFormProps {
  data: FooterContent;
  isRTL: boolean;
  t: TFunction;
  onChange: (value: FooterContent) => void;
}

export function FooterSectionForm({ data, isRTL, t, onChange }: FooterSectionFormProps) {
  const updateField = (field: keyof FooterContent) => (value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const updateSocialLink = (index: number, field: "label" | "url", value: string) => {
    const links = data.socialLinks?.map((link, linkIndex) =>
      linkIndex === index ? { ...link, [field]: value } : link,
    ) ?? [];
    onChange({
      ...data,
      socialLinks: links,
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className={isRTL ? "text-right" : "text-left"}>
            {t("admin.siteManagement.footer.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="footer-description" className={isRTL ? "block text-right" : "block text-left"}>
              {t("admin.siteManagement.footer.descriptionLabel")}
            </Label>
            <Textarea
              id="footer-description"
              value={data.description || ""}
              onChange={(event) => updateField("description")(event.target.value)}
              dir={isRTL ? "rtl" : "ltr"}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="footer-phone" className={isRTL ? "block text-right" : "block text-left"}>
                {t("admin.siteManagement.footer.phoneLabel")}
              </Label>
              <Input
                id="footer-phone"
                value={data.phone || ""}
                onChange={(event) => updateField("phone")(event.target.value)}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="footer-email" className={isRTL ? "block text-right" : "block text-left"}>
                {t("admin.siteManagement.footer.emailLabel")}
              </Label>
              <Input
                id="footer-email"
                type="email"
                value={data.email || ""}
                onChange={(event) => updateField("email")(event.target.value)}
                dir="ltr"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="footer-address" className={isRTL ? "block text-right" : "block text-left"}>
                {t("admin.siteManagement.footer.addressLabel")}
              </Label>
              <Input
                id="footer-address"
                value={data.address || ""}
                onChange={(event) => updateField("address")(event.target.value)}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className={isRTL ? "text-right" : "text-left"}>
            {t("admin.siteManagement.footer.socialLinksTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.socialLinks?.map((link, index) => (
            <Card key={link.key}>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label className={isRTL ? "block text-right" : "block text-left"}>
                    {t("admin.siteManagement.footer.socialLinkLabel", { index: index + 1 })}
                  </Label>
                  <Input
                    value={link.label || ""}
                    onChange={(event) => updateSocialLink(index, "label", event.target.value)}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={isRTL ? "block text-right" : "block text-left"}>
                    {t("admin.siteManagement.footer.socialLinkUrl", { index: index + 1 })}
                  </Label>
                  <Input
                    value={link.url || ""}
                    onChange={(event) => updateSocialLink(index, "url", event.target.value)}
                    dir="ltr"
                    placeholder="https://"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </>
  );
}

