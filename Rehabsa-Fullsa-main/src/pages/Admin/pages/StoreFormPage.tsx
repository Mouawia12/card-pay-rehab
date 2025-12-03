import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createBusiness, fetchBusiness, updateBusiness, type BusinessPayload } from "@/lib/api";

const defaultForm: BusinessPayload = {
  name: "",
  slug: "",
  email: "",
  phone: "",
  country: "Saudi Arabia",
  city: "",
  address: "",
  currency: "SAR",
  theme_primary: "#3b82f6",
  theme_secondary: "#111827",
  logo_url: "",
  cover_url: "",
};

export function StoreFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  const isEditMode = useMemo(() => Boolean(id), [id]);
  const [form, setForm] = useState<BusinessPayload>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isEditMode || !id) return;

    const loadBusiness = async () => {
      setIsLoading(true);
      try {
        const response = await fetchBusiness(id);
        const business = response.data;
        setForm({
          name: business.name,
          slug: business.slug,
          email: business.email,
          phone: business.phone,
          country: business.country,
          city: business.city,
          address: business.address,
          currency: business.currency ?? "SAR",
          theme_primary: business.theme_primary,
          theme_secondary: business.theme_secondary,
          logo_url: business.logo_url,
          cover_url: business.cover_url,
        });
      } catch {
        toast.error(t("common.error"));
      } finally {
        setIsLoading(false);
      }
    };

    loadBusiness();
  }, [id, isEditMode, t]);

  const updateField = (field: keyof BusinessPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error(t("admin.stores.nameRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        await updateBusiness(id, form);
        toast.success(t("admin.stores.updateSuccess"));
      } else {
        await createBusiness(form);
        toast.success(t("admin.stores.createSuccess"));
      }
      navigate("/admin/stores");
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex flex-col gap-4 p-4 h-full ${isRTL ? "font-arabic" : "font-sans"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className={`flex items-center justify-between ${isRTL ? "flex-row" : "flex-row"}`}>
        <h1 className="text-2xl font-semibold">
          {isEditMode ? t("admin.stores.editStore") : t("admin.stores.addStore")}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            {t("common.back")}
          </Button>
          <Button type="submit" form="store-form" disabled={isSubmitting}>
            {isSubmitting ? t("common.loading") : t("common.save")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.stores.storeInformation")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
          ) : (
            <form id="store-form" className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">{t("admin.stores.storeName")}</Label>
                <Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">{t("admin.stores.slug")}</Label>
                <Input id="slug" value={form.slug ?? ""} onChange={(e) => updateField("slug", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("admin.stores.email")}</Label>
                <Input id="email" type="email" value={form.email ?? ""} onChange={(e) => updateField("email", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t("admin.stores.phone")}</Label>
                <Input id="phone" value={form.phone ?? ""} onChange={(e) => updateField("phone", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">{t("admin.stores.country")}</Label>
                <Input id="country" value={form.country ?? ""} onChange={(e) => updateField("country", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">{t("admin.stores.city")}</Label>
                <Input id="city" value={form.city ?? ""} onChange={(e) => updateField("city", e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">{t("admin.stores.address")}</Label>
                <Textarea id="address" value={form.address ?? ""} onChange={(e) => updateField("address", e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">{t("admin.stores.currency")}</Label>
                <select
                  id="currency"
                  value={form.currency ?? "SAR"}
                  onChange={(e) => updateField("currency", e.target.value)}
                  className="border rounded-md px-3 py-2"
                >
                  <option value="SAR">SAR</option>
                  <option value="USD">USD</option>
                  <option value="AED">AED</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme_primary">{t("admin.stores.themePrimary")}</Label>
                <Input
                  id="theme_primary"
                  type="color"
                  value={form.theme_primary ?? "#3b82f6"}
                  onChange={(e) => updateField("theme_primary", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme_secondary">{t("admin.stores.themeSecondary")}</Label>
                <Input
                  id="theme_secondary"
                  type="color"
                  value={form.theme_secondary ?? "#111827"}
                  onChange={(e) => updateField("theme_secondary", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo_url">{t("admin.stores.logoUrl")}</Label>
                <Input id="logo_url" value={form.logo_url ?? ""} onChange={(e) => updateField("logo_url", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover_url">{t("admin.stores.coverUrl")}</Label>
                <Input id="cover_url" value={form.cover_url ?? ""} onChange={(e) => updateField("cover_url", e.target.value)} />
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
